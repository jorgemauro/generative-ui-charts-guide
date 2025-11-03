import { useState, useEffect } from 'react';
import { ChartRequest, ChatMessage } from '@/lib/llm-service';

const STORAGE_KEY = 'chart-history';
const MAX_HISTORY_ITEMS = 20; // Limite de itens no histórico

/**
 * Representa uma versão específica de um gráfico
 */
export interface ChartVersion {
  versionId: string;
  timestamp: number;
  request: string;
  charts: ChartRequest[];
  isAdjustment: boolean;
}

/**
 * Representa um item no histórico com múltiplas versões
 */
export interface HistoryItem {
  id: string;
  originalRequest: string;
  timestamp: number;
  versions: ChartVersion[];
  messages?: ChatMessage[];
}

/**
 * Hook para gerenciar o histórico de gráficos com suporte a versões
 * Usa localStorage para persistência
 */
export function useChartHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validar estrutura
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Erro ao salvar histórico:', error);
      }
    }
  }, [history, isLoaded]);

  /**
   * Adiciona um novo gráfico ao histórico
   * @returns ID do novo item criado
   */
  const addNewChart = (
    request: string,
    charts: ChartRequest[],
    messages: ChatMessage[] = []
  ): string => {
    const id = Date.now().toString();
    const newItem: HistoryItem = {
      id,
      originalRequest: request,
      timestamp: Date.now(),
      versions: [
        {
          versionId: `${id}-v1`,
          timestamp: Date.now(),
          request,
          charts,
          isAdjustment: false,
        },
      ],
      messages,
    };

    setHistory((prev) => {
      // Adicionar no início e limitar o tamanho
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });

    return id;
  };

  /**
   * Adiciona uma nova versão a um item existente
   */
  const addVersion = (
    historyId: string,
    request: string,
    charts: ChartRequest[],
    isAdjustment: boolean,
    messages: ChatMessage[] = []
  ) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id === historyId) {
          const versionNumber = item.versions.length + 1;
          return {
            ...item,
            versions: [
              ...item.versions,
              {
                versionId: `${historyId}-v${versionNumber}`,
                timestamp: Date.now(),
                request,
                charts,
                isAdjustment,
              },
            ],
            messages,
            timestamp: Date.now(), // Atualiza timestamp do item
          };
        }
        return item;
      })
    );
  };

  /**
   * Remove um item do histórico
   */
  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Limpa todo o histórico
   */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Busca um item específico por ID
   */
  const getHistoryItem = (id: string): HistoryItem | undefined => {
    return history.find((item) => item.id === id);
  };

  /**
   * Busca uma versão específica
   */
  const getVersion = (historyId: string, versionId: string): ChartVersion | undefined => {
    const item = getHistoryItem(historyId);
    return item?.versions.find((v) => v.versionId === versionId);
  };

  return {
    history,
    isLoaded,
    addNewChart,
    addVersion,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
    getVersion,
  };
}


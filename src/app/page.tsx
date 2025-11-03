'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { ChartHistory } from '@/components/ChartHistory';
import { FileUpload } from '@/components/FileUpload';
import { ChartRequest, ChatMessage, FileData } from '@/lib/llm-service';
import { FileParser } from '@/lib/file-parser';
import { useChartHistory, ChartVersion, HistoryItem } from '@/hooks/useChartHistory';
import { Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [charts, setCharts] = useState<ChartRequest[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    history,
    isLoaded: historyLoaded,
    addNewChart,
    addVersion,
    removeFromHistory,
    clearHistory,
  } = useChartHistory();

  const handleGenerateChart = async () => {
    if (!userInput.trim()) return;

    const messageText = userInput.trim();
    setIsLoading(true);
    setError(null);

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          chatHistory: messages,
          currentCharts: charts.length > 0 ? charts : undefined,
          fileData: fileData || undefined,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setCharts([]);
      } else {
        const { charts: newCharts, isAdjustment, explanation } = result;
        
        // Criar mensagem do assistente
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: explanation || 'Gráfico criado com sucesso!',
          timestamp: Date.now(),
          chartData: newCharts,
        };

        // Atualizar histórico de mensagens
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        setCharts(newCharts);

        // Gerenciar histórico de gráficos
        if (isAdjustment && currentHistoryId) {
          // Adicionar como nova versão do gráfico atual
          addVersion(currentHistoryId, messageText, newCharts, true, updatedMessages);
        } else {
          // Criar novo item no histórico
          const newHistoryId = addNewChart(messageText, newCharts, updatedMessages);
          setCurrentHistoryId(newHistoryId);
        }

        setUserInput('');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromHistory = (item: HistoryItem, version?: ChartVersion) => {
    const selectedVersion = version || item.versions[item.versions.length - 1];
    setCharts(selectedVersion.charts);
    setMessages(item.messages || []);
    setCurrentHistoryId(item.id);
    setError(null);
  };

  const handleFileLoaded = (data: FileData) => {
    setFileData(data);
    setError(null);
    
    // Sugerir prompt baseado nos dados
    const suggestion = FileParser.suggestChart(data);
    setUserInput(suggestion);
  };

  const handleFileClear = () => {
    setFileData(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerateChart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            UI Generativa - Etapa 3
          </h1>
          <p className="text-gray-400">
            Histórico e contexto conversacional
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Coluna Principal - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
          {/* Error Display */}
          {error && (
            <Card className="border-red-500/50 bg-red-900/20 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-300 font-semibold">Erro:</p>
                  <p className="text-red-200">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts Display */}
          {charts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Gráficos Gerados
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setCharts([])}
                  className="border-slate-600 hover:bg-slate-800"
                >
                  Limpar
                </Button>
              </div>
              <ChartRenderer charts={charts} />
            </div>
          )}

          {/* Input Form */}
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Descreva seu gráfico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Integrado */}
              <FileUpload
                onFileLoaded={handleFileLoaded}
                onClear={handleFileClear}
                currentFile={fileData}
                compact={true}
              />
              
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Crie um gráfico de barras com vendas de 5 produtos: A=100, B=200, C=300, D=150, E=250"
                className="min-h-[120px] bg-slate-950/70 border-slate-600 text-white placeholder:text-gray-500"
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Dica: Pressione Ctrl + Enter para gerar
                </p>
                <Button
                  onClick={handleGenerateChart}
                  disabled={isLoading || !userInput.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Gerar Gráfico
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Sidebar - Histórico - 1/3 */}
          <div className="lg:col-span-1">
            {historyLoaded && (
              <div className="sticky top-8">
                <ChartHistory
                  history={history}
                  onSelectItem={handleLoadFromHistory}
                  onRemoveItem={removeFromHistory}
                  onClearHistory={clearHistory}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


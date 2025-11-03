'use client';

import { useState } from 'react';
import { ChartRequest } from '@/lib/llm-service';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          chatHistory: [],
          currentCharts: null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar requisição');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiAwYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 pt-8">
          <div className="inline-block mb-4 p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/30">
            <div className="text-5xl">🎨</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
            Generative UI Charts
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Teste o endpoint de IA - <span className="text-blue-400 font-semibold">Etapa 1 do Guide</span>
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-xl border border-red-500/50 rounded-2xl p-6 mb-6 shadow-xl shadow-red-500/10 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-300 mb-2 text-lg">Erro ao processar</h3>
                  <p className="text-red-200/90">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                Resposta da API
              </h3>
              
              {/* Charts Info */}
              {response.charts && response.charts.length > 0 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-xl p-5 backdrop-blur-sm">
                    <p className="text-green-300 font-semibold text-lg flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      {response.charts.length} gráfico(s) gerado(s) com sucesso!
                    </p>
                  </div>

                  {response.charts.map((chart: ChartRequest, idx: number) => (
                    <div key={idx} className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full uppercase shadow-lg shadow-blue-500/30">
                          {chart.type}
                        </span>
                        <h4 className="text-white font-bold text-lg">{chart.title}</h4>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {chart.xAxisLabel && (
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-gray-500 font-semibold">Eixo X:</span> 
                            <span className="text-blue-300">{chart.xAxisLabel}</span>
                          </p>
                        )}
                        {chart.yAxisLabel && (
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-gray-500 font-semibold">Eixo Y:</span> 
                            <span className="text-blue-300">{chart.yAxisLabel}</span>
                          </p>
                        )}
                        {chart.description && (
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-500 font-semibold">Descrição:</span> {chart.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                          <span>📊</span>
                          Dados:
                        </p>
                        <div className="bg-slate-950/70 rounded-lg p-4 overflow-x-auto border border-slate-700/50">
                          <pre className="text-xs text-gray-300 font-mono">
                            {JSON.stringify(chart.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Raw JSON */}
              <details className="mt-8 group">
                <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors font-semibold flex items-center gap-2 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30">
                  <span>📋</span>
                  Ver JSON completo
                  <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">Clique para expandir</span>
                </summary>
                <div className="mt-4 bg-slate-950/70 rounded-xl p-5 overflow-x-auto border border-slate-700/50">
                  <pre className="text-xs text-gray-300 font-mono">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Input Form */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-xl">✍️</span>
                  Digite sua solicitação de gráfico
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Crie um gráfico de barras com vendas: A=100, B=200, C=300"
                  className="w-full px-5 py-4 bg-slate-950/70 border border-slate-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none backdrop-blur-sm"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>🚀</span>
                      Gerar Gráfico
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <span>🗑️</span>
                    Limpar
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Examples */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Exemplos de Solicitações
            </h3>
            <div className="grid gap-3">
              {[
                { icon: '📊', text: 'Crie um gráfico de barras com vendas: A=100, B=200, C=300' },
                { icon: '📈', text: 'Mostre um gráfico de linha com temperatura por mês: Jan=10, Fev=15, Mar=20' },
                { icon: '🥧', text: 'Faça um gráfico de pizza com distribuição: Mobile=40%, Desktop=35%, Tablet=25%' },
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(example.text)}
                  disabled={loading}
                  className="w-full text-left px-5 py-3 bg-slate-900/50 hover:bg-slate-800/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 text-sm border border-slate-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-lg group-hover:scale-110 transition-transform">{example.icon}</span>
                    <span className="flex-1">{example.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 max-w-2xl mx-auto">
            <p className="text-gray-400 flex items-center justify-center gap-2 mb-3">
              <span className="text-lg">🔧</span>
              <span>Endpoint:</span>
              <code className="bg-slate-950/70 px-3 py-1.5 rounded-lg text-blue-400 font-mono text-sm border border-slate-700/50">/api</code>
            </p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <span className="text-base">📚</span>
              Guia de Implementação - <span className="text-blue-400 font-semibold">Etapa 1: AI Endpoint</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}


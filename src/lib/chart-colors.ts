/**
 * Paleta de cores padrão para gráficos
 */
const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#6366f1', // indigo-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#a855f7', // purple-500
  '#ef4444', // red-500
];

/**
 * Garante que haja cores suficientes para o número de dados
 * Se não houver cores personalizadas, usa a paleta padrão
 * Se houver menos cores que dados, repete as cores
 */
export function ensureColors(dataLength: number, customColors?: string[]): string[] {
  const colors = customColors && customColors.length > 0 ? customColors : DEFAULT_COLORS;
  
  if (colors.length >= dataLength) {
    return colors.slice(0, dataLength);
  }
  
  // Se precisar de mais cores, repete a paleta
  const result: string[] = [];
  for (let i = 0; i < dataLength; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
}

/**
 * Exporta as cores padrão caso precise usá-las diretamente
 */
export { DEFAULT_COLORS };


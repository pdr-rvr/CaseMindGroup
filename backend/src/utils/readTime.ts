/**
 * Calcula o tempo estimado de leitura em minutos com base na contagem de palavras.
 * Média padrão: 200 palavras por minuto.
 */
export function calculateReadTimeMinutes(content: string): number {
  if (!content || typeof content !== 'string') return 1;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

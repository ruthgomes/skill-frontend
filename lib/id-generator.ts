/**
 * Gera IDs únicos seguros para uso na aplicação
 * Usa crypto.randomUUID() quando disponível (Node 14.17+, navegadores modernos)
 * Fallback para timestamp + random para compatibilidade
 */

export function generateId(): string {
  // Use crypto.randomUUID se disponível (mais seguro)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback: timestamp + random string (menos seguro mas aceitável para IDs não-críticos)
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const randomPart2 = Math.random().toString(36).substring(2, 15)
  
  return `${timestamp}-${randomPart}${randomPart2}`
}

/**
 * Gera um ID curto baseado em timestamp (para uso temporário em UI)
 * NÃO usar para identificação crítica ou de segurança
 */
export function generateShortId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

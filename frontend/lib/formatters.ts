/**
 * Formate une date en format lisible (ex: "il y a 5 min")
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (days > 7) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  } else if (days > 0) {
    return `il y a ${days} j`
  } else if (hours > 0) {
    return `il y a ${hours} h`
  } else if (minutes > 0) {
    return `il y a ${minutes} min`
  } else {
    return 'à l\'instant'
  }
}

/**
 * Génère un nombre pseudo-aléatoire basé sur un ID
 */
export function hashId(id: number, multiplier: number): number {
  return id * multiplier
}

/**
 * Retourne un nombre aléatoire basé sur le hash d'un ID
 */
export function getRandomFromHash(id: number, multiplier: number, max: number, min: number): number {
  const hash = hashId(id, multiplier)
  return Math.floor((hash % (max - min + 1)) + min)
}

export const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatDateShort = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(isoString)
}

export const getMonthDateRange = (date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const start = new Date(year, month, 1).toISOString()
  const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString()
  return { start, end }
}

export const getMonthLabel = (date = new Date()) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export const getMonthKey = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const isCurrentMonth = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

export const daysSince = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  return Math.floor((now - date) / (1000 * 60 * 60 * 24))
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

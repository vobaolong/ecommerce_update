export const calcTime = (from) =>
  (new Date().getTime() - new Date(from).getTime()) / (1000 * 3600)

export const timeAgo = (dateParam) => {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
  const today = new Date()
  const seconds = Math.round((today - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const weeks = Math.round(days / 7)
  const months = Math.round(days / 30)
  const years = Math.round(months / 12)

  if (seconds < 60) return `${seconds} giây trước`
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  if (weeks < 4) return `${weeks} tuần trước`
  if (months < 12) return `${months} tháng trước`
  return `${years} năm trước`
}

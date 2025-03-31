export const readableDate = (date) => {
  date = new Date(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${hours}${minutes}${seconds}${day}${month}${date.getFullYear()}`
}

export const calculateDaysDifference = (date) =>
  Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  )

export const formatDate = (date) => {
  date = new Date(date)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

export const formatDateMonth = (date) => {
  date = new Date(date)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export const formatOnlyDate = (date) =>
  String(new Date(date).getDate()).padStart(2, '0')

export const formatMonth = (date) => {
  date = new Date(date)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${month}/${date.getFullYear()}`
}

export const formatYear = (date) => new Date(date).getFullYear()

export const formatTime = (date) => {
  date = new Date(date)
  return `${date.getHours()}h ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

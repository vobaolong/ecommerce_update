export const sameDate = (a, b) => {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth()
  )
}

export const sameMonth = (a, b) => {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  )
}

export const sameYear = (a, b) => {
  return new Date(a).getFullYear() === new Date(b).getFullYear()
}

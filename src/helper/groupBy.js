import { formatDate, formatMonth, formatYear, formatTime } from './readable'
export const groupByDate = (items, by, role) => {
  const formatFunc =
    by === 'date'
      ? formatDate
      : by === 'month'
      ? formatMonth
      : by === 'year'
      ? formatYear
      : formatTime

  return items
    ?.map((item) =>
      role === 'admin'
        ? {
            amount: parseFloat(item.platformFee.$numberDecimal),
            createdAt: formatFunc(item.createdAt)
          }
        : {
            storeRevenue: parseFloat(item.storeRevenue.$numberDecimal),
            platformFee: parseFloat(item.platformFee.$numberDecimal),
            createdAt: formatFunc(item.createdAt)
          }
    )
    ?.reduce((acc, value) => {
      const existing = acc.find(([date]) => date === value.createdAt)
      if (existing) {
        if (role === 'admin') existing[1] += value.amount
        else {
          existing[1] += value.storeRevenue
          existing[2] += value.platformFee
        }
      } else {
        acc.push(
          role === 'admin'
            ? [value.createdAt, value.amount]
            : [value.createdAt, value.storeRevenue, value.platformFee]
        )
      }
      return acc
    }, [])
}

export const groupByJoined = (items, by) => {
  const formatFunc =
    by === 'date'
      ? formatDate
      : by === 'month'
      ? formatMonth
      : by === 'year'
      ? formatYear
      : formatTime

  return items
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((item) => ({ createdAt: formatFunc(item.createdAt) }))
    .reduce((acc, value) => {
      const existing = acc.find(([date]) => date === value.createdAt)
      if (existing) existing[1] += 1
      else acc.push([value.createdAt, 1])
      return acc
    }, [])
}

export const groupBySold = (items, by, role, sliceEnd) =>
  items
    .slice(0, sliceEnd)
    .map((item) => ({ name: item.name, sold: item.sold }))
    .reduce((acc, value) => {
      const existing = acc.find(([name]) => name === value.name)
      if (existing)
        existing[1] = parseFloat(existing[1]) + parseFloat(value.sold)
      else acc.push([value.name, value.sold])
      return acc
    }, [])

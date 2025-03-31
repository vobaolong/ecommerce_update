const parseDecimal = (value) => parseFloat(value?.$numberDecimal || 0)

const calculateItemTotal = (items, priceKey) => {
  if (!Array.isArray(items)) return 0
  return items.reduce(
    (prev, item) =>
      prev +
      parseDecimal(item.productId?.[priceKey]) * parseFloat(item.count || 0),
    0
  )
}

const applyDiscount = (amount, level) => {
  const discount = parseDecimal(level?.discount)
  return (amount * (100 - discount)) / 100 || amount
}

export const totalProducts = (items = [], userLevel = {}) => {
  const totalPrice = calculateItemTotal(items, 'price')
  const totalSalePrice = calculateItemTotal(items, 'salePrice')
  const amountFromUser1 = applyDiscount(totalSalePrice, userLevel)

  return { totalPrice, totalSalePrice, amountFromUser1 }
}

export const totalShippingFee = (delivery = 0, userLevel = {}) => {
  const shippingFee = applyDiscount(delivery, userLevel)
  return { delivery, shippingFee }
}

export const totalCommission = (
  items = [],
  storeLevel = {},
  commission = {}
) => {
  const totalPrice = calculateItemTotal(items, 'price')
  const totalSalePrice = calculateItemTotal(items, 'salePrice')

  const commissionRate =
    parseDecimal(commission?.fee) - parseDecimal(storeLevel?.discount)
  const amountFromStore = (totalSalePrice * commissionRate) / 100 || 0
  const amountToStore = totalSalePrice - amountFromStore

  return { totalPrice, totalSalePrice, amountFromStore, amountToStore }
}

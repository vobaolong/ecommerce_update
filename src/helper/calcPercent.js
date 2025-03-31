export const calcPercent = (price = {}, salePrice = {}) =>
  Math.round(
    ((price.$numberDecimal - salePrice.$numberDecimal) / price.$numberDecimal) *
      100
  )

export const formatPrice = (price) =>
  new Intl.NumberFormat('de-DE').format(price)

export const convertVNDtoUSD = async (price) => {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/VND'
    )
    const data = await response.json()
    const rate = data.rates.USD
    return (parseFloat(price) * rate).toFixed(2)
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // Fallback if API fails
    return (parseFloat(price) * 0.00004).toFixed(2)
  }
}

export const formatNumber = (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '')
  e.target.value = value === '' ? '' : parseInt(value).toLocaleString('vi-VN')
}

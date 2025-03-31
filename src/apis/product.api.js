import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'
import qs from 'qs'

export const getProduct = async (productId) => {
  try {
    return await fetchJson(
      `${API_URL}/product/${productId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getProductByIdForManager = async (
  userId,
  token,
  productId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/for/manager/${productId}/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listActiveProducts = async (filter) => {
  const queryString = qs.stringify(filter, { encode: false })
  try {
    return await fetchJson(
      `${API_URL}/active/products?${queryString}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw error
  }
}

export const listSellingProductsByStore = async (filter, storeId) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/selling/products/by/store/${storeId}?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listProductsForManager = async (
  userId,
  token,
  filter,
  storeId
) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/products/by/store/${storeId}/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listProductsForAdmin = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/products/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const sellingProduct = async (
  userId,
  token,
  value,
  storeId,
  productId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/selling/${productId}/${storeId}/${userId}`,
      createFetchConfig('PUT', value, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const activeProduct = async (userId, token, value, productId) => {
  try {
    return await fetchJson(
      `${API_URL}/product/active/${productId}/${userId}`,
      createFetchConfig('PUT', value, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createProduct = async (userId, token, product, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/product/create/${storeId}/${userId}`,
      createFetchConfig('POST', product, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateProduct = async (
  userId,
  token,
  product,
  productId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/update/${productId}/${storeId}/${userId}`,
      createFetchConfig('PUT', product, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const addListImages = async (
  userId,
  token,
  photo,
  productId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/images/${productId}/${storeId}/${userId}`,
      createFetchConfig('POST', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateListImages = async (
  userId,
  token,
  photo,
  index,
  productId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/images/${productId}/${storeId}/${userId}?index=${index}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const removeListImages = async (
  userId,
  token,
  index,
  productId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/product/images/${productId}/${storeId}/${userId}?index=${index}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

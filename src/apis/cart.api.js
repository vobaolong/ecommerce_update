import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Cart API functions
export const getCartCount = async (userId, token) => {
  try {
    return await fetchJson(
      `${API_URL}/cart/count/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const addToCart = async (userId, token, cartItem) => {
  try {
    return await fetchJson(
      `${API_URL}/cart/add/${userId}`,
      createFetchConfig('POST', cartItem, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listCarts = async (userId, token, filter) => {
  const { limit, page } = filter
  try {
    return await fetchJson(
      `${API_URL}/carts/${userId}?limit=${limit}&page=${page}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listItemsByCart = async (userId, token, cartId) => {
  try {
    return await fetchJson(
      `${API_URL}/cart/items/${cartId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteFromCart = async (userId, token, cartItemId) => {
  try {
    return await fetchJson(
      `${API_URL}/cart/remove/${cartItemId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateCartItem = async (userId, token, count, cartItemId) => {
  try {
    return await fetchJson(
      `${API_URL}/cart/update/${cartItemId}/${userId}`,
      createFetchConfig('PUT', count, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

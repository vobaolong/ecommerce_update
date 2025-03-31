import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// User follow store
export const listFollowingStores = async (userId, token, filter) => {
  const { limit, page } = filter
  const query = new URLSearchParams({ limit, page }).toString()
  try {
    return await fetchJson(
      `${API_URL}/following/stores/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getNumberOfFollowers = async (storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/numberOfFollowers/${storeId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const checkFollowingStore = async (userId, token, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/check/following/stores/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const followStore = async (userId, token, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/follow/store/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const unfollowStore = async (userId, token, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/unfollow/store/${storeId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

// User follow product
export const followProduct = async (userId, token, productId) => {
  try {
    return await fetchJson(
      `${API_URL}/follow/product/${productId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const unfollowProduct = async (userId, token, productId) => {
  try {
    return await fetchJson(
      `${API_URL}/unfollow/product/${productId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getNumberOfFollowersForProduct = async (productId) => {
  try {
    return await fetchJson(
      `${API_URL}/product/numberOfFollowers/${productId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const checkFollowingProduct = async (userId, token, productId) => {
  try {
    return await fetchJson(
      `${API_URL}/check/following/products/${productId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listFollowingProducts = async (userId, token, filter) => {
  const { limit, page } = filter
  const query = new URLSearchParams({ limit, page }).toString()
  try {
    return await fetchJson(
      `${API_URL}/following/products/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

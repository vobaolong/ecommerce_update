import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Order API functions
export const getOrderByUser = async (userId, token, orderId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/by/user/${orderId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createReturnRequest = async (userId, token, orderId, reason) => {
  try {
    return await fetchJson(
      `${API_URL}/order/return/${orderId}/${userId}`,
      createFetchConfig('POST', { reason }, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getOrderByStore = async (userId, token, orderId, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/by/store/${orderId}/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getOrderForAdmin = async (userId, token, orderId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/for/admin/${orderId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createOrder = async (userId, token, cartId, order) => {
  try {
    return await fetchJson(
      `${API_URL}/order/create/${cartId}/${userId}`,
      createFetchConfig('POST', order, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listItemsByOrder = async (userId, token, orderId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/items/by/user/${orderId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listItemsByOrderByStore = async (
  userId,
  token,
  orderId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/order/items/by/store/${orderId}/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listItemsByOrderForAdmin = async (userId, token, orderId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/items/for/admin/${orderId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listOrdersByUser = async (userId, token, filter) => {
  const { search, sortBy, order, limit, page, status } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    status
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/orders/by/user/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listOrdersByStore = async (userId, token, filter, storeId) => {
  const { search, sortBy, order, limit, page, status } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    status
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/orders/by/store/${storeId}/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listReturnByStore = async (userId, token, filter, storeId) => {
  const { search, sortBy, order, limit, page, status } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    status
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/order/return/by/store/${storeId}/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listOrdersForAdmin = async (userId, token, filter) => {
  const { search, sortBy, order, limit, page, status } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    status
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/orders/for/admin/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const userCancelOrder = async (userId, token, status, orderId) => {
  try {
    return await fetchJson(
      `${API_URL}/order/update/by/user/${orderId}/${userId}`,
      createFetchConfig('PUT', status, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const sellerUpdateStatusOrder = async (
  userId,
  token,
  status,
  orderId,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/order/update/by/store/${orderId}/${storeId}/${userId}`,
      createFetchConfig('PUT', status, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const sellerUpdateReturnStatusOrder = async (
  userId,
  token,
  status,
  orderId,
  storeId
) => {
  try {
    const response = await fetch(
      `${API_URL}/order/return/${orderId}/${storeId}/${userId}/approve`,
      createFetchConfig('POST', { status }, token)
    )
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }
    return data
  } catch (error) {
    console.error('Error in sellerUpdateReturnStatusOrder:', error)
    throw error
  }
}

export const countOrder = async (status, userId, storeId) => {
  const query = new URLSearchParams({ status, userId, storeId }).toString()
  try {
    return await fetchJson(
      `${API_URL}/orders/count?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

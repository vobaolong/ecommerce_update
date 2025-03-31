import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Notification API functions
export const getNotifications = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/notification/${userId}`,
      createFetchConfig('GET')
    )
  } catch {
    return [{ notifications: [], numberHidden: 0 }]
  }
}

export const updateRead = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/notification/${userId}`,
      createFetchConfig('PUT')
    )
  } catch (error) {
    console.log(error)
  }
}

export const sendBanStoreEmail = async (userId, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/send-ban-store/${userId}/${storeId}`,
      createFetchConfig('POST')
    )
  } catch (error) {
    console.log(error)
  }
}

export const sendCreateStoreEmail = async (userId, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/send-create-store/${userId}/${storeId}`,
      createFetchConfig('POST')
    )
  } catch (error) {
    console.log(error)
  }
}

export const sendActiveStoreEmail = async (userId, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/send-active-store/${userId}/${storeId}`,
      createFetchConfig('POST')
    )
  } catch (error) {
    console.log(error)
  }
}

export const sendActiveProductEmail = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/send-active-product/${userId}`,
      createFetchConfig('POST')
    )
  } catch (error) {
    console.log(error)
  }
}

export const sendBanProductEmail = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/send-ban-product/${userId}`,
      createFetchConfig('POST')
    )
  } catch (error) {
    console.log(error)
  }
}

export const deleteNotifications = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/notification/${userId}`,
      createFetchConfig('DELETE')
    )
  } catch (error) {
    console.log(error)
  }
}

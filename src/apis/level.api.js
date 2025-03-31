import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// User level API functions
export const getUserLevel = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/user/level/${userId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listUserLevels = async (userId, token, filter) => {
  const { search, sortBy, order, limit, page } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/user/levels/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createUserLevel = async (userId, token, level) => {
  try {
    return await fetchJson(
      `${API_URL}/user/level/create/${userId}`,
      createFetchConfig('POST', level, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateUserLevel = async (userId, token, levelId, level) => {
  try {
    return await fetchJson(
      `${API_URL}/user/level/${levelId}/${userId}`,
      createFetchConfig('PUT', level, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteUserLevel = async (userId, token, levelId) => {
  try {
    return await fetchJson(
      `${API_URL}/user/level/${levelId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreUserLevel = async (userId, token, levelId) => {
  try {
    return await fetchJson(
      `${API_URL}/user/level/restore/${levelId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

// Store level API functions
export const getStoreLevel = async (storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/level/${storeId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listStoreLevels = async (userId, token, filter) => {
  const { search, sortBy, order, limit, page } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/store/levels/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createStoreLevel = async (userId, token, level) => {
  try {
    return await fetchJson(
      `${API_URL}/store/level/create/${userId}`,
      createFetchConfig('POST', level, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateStoreLevel = async (userId, token, levelId, level) => {
  try {
    return await fetchJson(
      `${API_URL}/store/level/${levelId}/${userId}`,
      createFetchConfig('PUT', level, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteStoreLevel = async (userId, token, levelId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/level/${levelId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreStoreLevel = async (userId, token, levelId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/level/restore/${levelId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

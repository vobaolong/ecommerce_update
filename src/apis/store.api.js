import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const getStoreProfile = async (userId, token, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/profile/${storeId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateProfile = async (userId, token, store, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/${storeId}/${userId}`,
      createFetchConfig('PUT', store, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getStore = async (storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/${storeId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getListStores = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/stores?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listStoresByUser = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/stores/by/user/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listStoresForAdmin = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/stores/for/admin/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createStore = async (userId, token, store) => {
  try {
    return await fetchJson(
      `${API_URL}/store/create/${userId}`,
      createFetchConfig('POST', store, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateAvatar = async (userId, token, photo, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/avatar/${storeId}/${userId}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateCover = async (userId, token, photo, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/cover/${storeId}/${userId}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const addFeaturedImage = async (userId, token, photo, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/featured/image/${storeId}/${userId}`,
      createFetchConfig('POST', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateFeaturedImage = async (
  userId,
  token,
  photo,
  index,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/store/featured/image/${storeId}/${userId}?index=${index}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const removeFeaturedImage = async (userId, token, index, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/featured/image/${storeId}/${userId}?index=${index}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const addStaff = async (userId, token, staff, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/staff/${storeId}/${userId}`,
      createFetchConfig('POST', { staff }, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteStaff = async (userId, token, staff, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/staff/remove/${storeId}/${userId}`,
      createFetchConfig('DELETE', { staff }, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const cancelStaff = async (userId, token, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/staff/cancel/${storeId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const openStore = async (userId, token, value, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/open/${storeId}/${userId}`,
      createFetchConfig('PUT', value, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const activeStore = async (userId, token, value, storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/active/${storeId}/${userId}`,
      createFetchConfig('PUT', value, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const addAddress = async (userId, token, address) => {
  try {
    return await fetchJson(
      `${API_URL}/user/address/${userId}`,
      createFetchConfig('POST', address, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateAddress = async (userId, token, index, address) => {
  try {
    return await fetchJson(
      `${API_URL}/user/address/${userId}?index=${index}`,
      createFetchConfig('PUT', address, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

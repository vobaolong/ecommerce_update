import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Commission API functions
export const listActiveCommissions = async () => {
  try {
    return await fetchJson(
      `${API_URL}/active/commissions`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listCommissions = async (userId, token, filter) => {
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
      `${API_URL}/commissions/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getCommissionByStore = async (storeId) => {
  try {
    return await fetchJson(
      `${API_URL}/store/commission/${storeId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createCommission = async (userId, token, commission) => {
  try {
    return await fetchJson(
      `${API_URL}/commission/create/${userId}`,
      createFetchConfig('POST', commission, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateCommission = async (
  userId,
  token,
  commissionId,
  commission
) => {
  try {
    return await fetchJson(
      `${API_URL}/commission/${commissionId}/${userId}`,
      createFetchConfig('PUT', commission, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteCommission = async (userId, token, commissionId) => {
  try {
    return await fetchJson(
      `${API_URL}/commission/${commissionId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreCommission = async (userId, token, commissionId) => {
  try {
    return await fetchJson(
      `${API_URL}/commission/restore/${commissionId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

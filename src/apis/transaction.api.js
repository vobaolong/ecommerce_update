import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const listTransactionsByUser = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/transactions/by/user/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listTransactionsByStore = async (
  userId,
  token,
  filter,
  storeId
) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/transactions/by/store/${storeId}/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listTransactionsForAdmin = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/transactions/for/admin/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createTransactionByUser = async (userId, token, transaction) => {
  try {
    return await fetchJson(
      `${API_URL}/transaction/create/by/user/${userId}`,
      createFetchConfig('POST', transaction, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createTransactionByStore = async (
  userId,
  token,
  transaction,
  storeId
) => {
  try {
    return await fetchJson(
      `${API_URL}/transaction/create/by/store/${storeId}/${userId}`,
      createFetchConfig('POST', transaction, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

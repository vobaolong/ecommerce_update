import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'
import { refreshTokenApi, getToken } from './auth.api'
import jwt from 'jsonwebtoken'

export const getUser = async (userId) => {
  try {
    return await fetchJson(
      `${API_URL}/user/${userId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getListUsers = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/users?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listUserForAdmin = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/users/for/admin/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getUserProfile = async (userId, token) => {
  const { refreshToken, _id, role } = getToken()
  const decoded = jwt.decode(token)
  const timeout = (decoded.exp - 60) * 1000 - Date.now()
  setTimeout(() => refreshTokenApi(refreshToken, _id, role), timeout)

  try {
    return await fetchJson(
      `${API_URL}/user/profile/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateProfile = async (userId, token, user) => {
  try {
    return await fetchJson(
      `${API_URL}/user/profile/${userId}`,
      createFetchConfig('PUT', user, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateAvatar = async (userId, token, photo) => {
  try {
    return await fetchJson(
      `${API_URL}/user/avatar/${userId}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateCover = async (userId, token, photo) => {
  try {
    return await fetchJson(
      `${API_URL}/user/cover/${userId}`,
      createFetchConfig('PUT', photo, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updatePassword = async (userId, token, user) => {
  try {
    return await fetchJson(
      `${API_URL}/user/password/${userId}`,
      createFetchConfig('PUT', user, token)
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

export const deleteAddresses = async (userId, token, index) => {
  try {
    return await fetchJson(
      `${API_URL}/user/address/${userId}?index=${index}`,
      createFetchConfig('DELETE', null, token)
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

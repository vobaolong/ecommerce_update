import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const listReviews = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/reviews?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const checkReview = async (userId, token, data) => {
  try {
    return await fetchJson(
      `${API_URL}/review/check/${userId}`,
      createFetchConfig('POST', data, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const reviewProduct = async (userId, token, review) => {
  try {
    return await fetchJson(
      `${API_URL}/review/create/${userId}`,
      createFetchConfig('POST', review, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const editReview = async (userId, token, review, reviewId) => {
  try {
    return await fetchJson(
      `${API_URL}/review/${reviewId}/${userId}`,
      createFetchConfig('PUT', review, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const removeReview = async (userId, token, reviewId) => {
  try {
    return await fetchJson(
      `${API_URL}/review/${reviewId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteReviews = async (userId, token, reviewId) => {
  try {
    return await fetchJson(
      `${API_URL}/reviews/${reviewId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

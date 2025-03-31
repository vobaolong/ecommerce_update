import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Category API functions
export const getCategoryById = async (categoryId) => {
  try {
    return await fetchJson(
      `${API_URL}/category/by/id/${categoryId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listActiveCategories = async (filter) => {
  const { search, sortBy, order, limit, page, categoryId } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    categoryId
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/active/categories?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listCategories = async (userId, token, filter) => {
  const { search, sortBy, order, limit, page, categoryId } = filter
  const query = new URLSearchParams({
    search,
    sortBy,
    order,
    limit,
    page,
    categoryId
  }).toString()
  try {
    return await fetchJson(
      `${API_URL}/categories/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createCategory = async (userId, token, category) => {
  try {
    return await fetchJson(
      `${API_URL}/category/create/${userId}`,
      createFetchConfig('POST', category, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateCategory = async (userId, token, categoryId, category) => {
  try {
    return await fetchJson(
      `${API_URL}/category/${categoryId}/${userId}`,
      createFetchConfig('PUT', category, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteCategory = async (userId, token, categoryId) => {
  try {
    return await fetchJson(
      `${API_URL}/category/${categoryId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreCategory = async (userId, token, categoryId) => {
  try {
    return await fetchJson(
      `${API_URL}/category/restore/${categoryId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

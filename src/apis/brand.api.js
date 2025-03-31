import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const getBrandById = async (userId, token, brandId) => {
  try {
    return await fetchJson(
      `${API_URL}/brand/by/id/${brandId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listBrands = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/brands?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listBrandByCategory = async (categoryId) => {
  try {
    const data = await fetchJson(
      `${API_URL}/active/brands?categoryId=${categoryId}`,
      createFetchConfig('GET')
    )
    console.log('API Response:', data)
    return data
  } catch (error) {
    console.log('API Error:', error)
    return null
  }
}

export const createBrand = async (userId, token, brand) => {
  try {
    return await fetchJson(
      `${API_URL}/brand/create/${userId}`,
      createFetchConfig('POST', brand, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateBrand = async (userId, token, brandId, brand) => {
  try {
    return await fetchJson(
      `${API_URL}/brand/${brandId}/${userId}`,
      createFetchConfig('PUT', brand, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteBrand = async (userId, token, brandId) => {
  try {
    return await fetchJson(
      `${API_URL}/brand/${brandId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreBrand = async (userId, token, brandId) => {
  try {
    return await fetchJson(
      `${API_URL}/brand/restore/${brandId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

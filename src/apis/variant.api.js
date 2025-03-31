import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const getVariantById = async (userId, token, variantId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/by/id/${variantId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listVariants = async (userId, token, filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/variants/${userId}?${query}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listVariantByCategory = async (categoryId) => {
  const query = new URLSearchParams({ categoryId, limit: '100' }).toString()
  try {
    return await fetchJson(
      `${API_URL}/active/variants?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createVariant = async (userId, token, variant) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/create/${userId}`,
      createFetchConfig('POST', variant, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateVariant = async (userId, token, variantId, variant) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/${variantId}/${userId}`,
      createFetchConfig('PUT', variant, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteVariant = async (userId, token, variantId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/${variantId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreVariant = async (userId, token, variantId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/restore/${variantId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listActiveVariantValues = async (variantId) => {
  try {
    return await fetchJson(
      `${API_URL}/active/variant/values/by/variant/${variantId}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const listVariantValues = async (userId, token, variantId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/values/by/variant/${variantId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const createVariantValue = async (userId, token, variantValue) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/value/create/${userId}`,
      createFetchConfig('POST', variantValue, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateVariantValue = async (
  userId,
  token,
  valueId,
  variantValue
) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/value/${valueId}/${userId}`,
      createFetchConfig('PUT', variantValue, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteVariantValue = async (userId, token, variantValueId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/value/${variantValueId}/${userId}`,
      createFetchConfig('DELETE', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const restoreVariantValue = async (userId, token, variantValueId) => {
  try {
    return await fetchJson(
      `${API_URL}/variant/value/restore/${variantValueId}/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

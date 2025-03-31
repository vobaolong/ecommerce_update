import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const getAddressCache = async (address) => {
  try {
    return await fetchJson(
      `${API_URL}/cacheAddress/${address}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.error('Failed to get address cache:', error)
    return null
  }
}

export const getProvinces = async () => {
  try {
    return await fetchJson(`${API_URL}/getProvinces`, createFetchConfig('GET'))
  } catch (error) {
    console.error('Failed to get provinces:', error)
    return []
  }
}

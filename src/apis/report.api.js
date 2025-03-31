import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

export const listReportsForAdmin = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  try {
    return await fetchJson(
      `${API_URL}/reports?${query}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

export const reportByUser = async (data) => {
  try {
    return await fetchJson(
      `${API_URL}/reports`,
      createFetchConfig('POST', data)
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteReport = async (reportId) => {
  try {
    return await fetchJson(
      `${API_URL}/reports/${reportId}`,
      createFetchConfig('DELETE')
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

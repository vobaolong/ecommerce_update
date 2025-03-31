export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const createFetchConfig = (method, body = null, token = null) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  },
  ...(body && { body: JSON.stringify(body) })
})

// Xử lý fetch và trả về JSON
export const fetchJson = async (url, config) => {
  const response = await fetch(url, config)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response.json()
}

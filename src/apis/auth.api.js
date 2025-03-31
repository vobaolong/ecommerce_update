import { API_URL, createFetchConfig, fetchJson } from './apiUtils.api'

// Token management
export const setToken = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data))
  }
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('jwt')
  return token ? JSON.parse(token) : null
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
  }
}

// Auth API functions
export const refreshTokenApi = async (refreshToken, userId, role) => {
  try {
    const data = await fetchJson(
      `${API_URL}/refresh/token`,
      createFetchConfig('POST', { refreshToken })
    )
    if (data.error) {
      signout(refreshToken)
      return null
    }
    const tokenData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      _id: userId,
      role
    }
    setToken(tokenData)
    return tokenData
  } catch (error) {
    console.error('Refresh token failed:', error)
    signout(refreshToken)
    return null
  }
}

export const signup = async (user) => {
  try {
    return await fetchJson(`${API_URL}/signup`, createFetchConfig('POST', user))
  } catch (error) {
    console.error('Signup failed:', error)
    throw error
  }
}

export const signin = async (user) => {
  try {
    return await fetchJson(`${API_URL}/signin`, createFetchConfig('POST', user))
  } catch (error) {
    console.error('Signin failed:', error)
    throw error
  }
}

export const signout = async (refreshToken) => {
  try {
    await fetch(
      `${API_URL}/signout`,
      createFetchConfig('POST', { refreshToken })
    )
  } catch (error) {
    console.error('Signout failed:', error)
  } finally {
    removeToken()
  }
}

export const authSocial = async (user) => {
  try {
    return await fetchJson(
      `${API_URL}/auth/social`,
      createFetchConfig('POST', user)
    )
  } catch (error) {
    console.error('Social auth failed:', error)
    throw error
  }
}

export const sendConfirmationEmail = async (userId, token) => {
  try {
    return await fetchJson(
      `${API_URL}/confirm/email/${userId}`,
      createFetchConfig('GET', null, token)
    )
  } catch (error) {
    console.error('Send confirmation email failed:', error)
    throw error
  }
}

export const verifyEmail = async (emailCode) => {
  try {
    return await fetchJson(
      `${API_URL}/verify/email/${emailCode}`,
      createFetchConfig('GET')
    )
  } catch (error) {
    console.error('Verify email failed:', error)
    throw error
  }
}

export const forgotPassword = async (username) => {
  try {
    return await fetchJson(
      `${API_URL}/forgot/password`,
      createFetchConfig('POST', { username })
    )
  } catch (error) {
    console.error('Forgot password failed:', error)
    throw error
  }
}

export const changePassword = async (passwordCode, newPassword) => {
  try {
    return await fetchJson(
      `${API_URL}/change/password/${passwordCode}`,
      createFetchConfig('PUT', { newPassword })
    )
  } catch (error) {
    console.error('Change password failed:', error)
    throw error
  }
}

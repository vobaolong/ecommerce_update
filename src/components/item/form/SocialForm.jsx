import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authSocial, setToken } from '../../../apis/auth.api'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const SocialForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onSuccess = async (credentialResponse) => {
    setIsLoading(true)
    try {
      const token = credentialResponse.credential
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      )
      const data = await response.json()

      if (!data.email) throw new Error('Cannot retrieve user info')

      const user = {
        firstName: data.given_name || data.name?.split(' ')[0] || '',
        lastName: data.family_name || data.name?.split(' ')[1] || '',
        email: data.email,
        googleId: data.sub
      }

      const authData = await authSocial(user)
      if (authData.error) throw new Error(authData.error)

      const { accessToken, refreshToken, _id, role } = authData
      setToken({ accessToken, refreshToken, _id, role }, () => {
        navigate(0)
      })
    } catch (err) {
      setError(err.message || 'Server error!')
    } finally {
      setIsLoading(false)
    }
  }

  const onError = () => {
    setError('Google login failed')
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <Loading />}
      {error && (
        <div className='col-12'>
          <Error msg={error} />
        </div>
      )}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          render={(renderProps) => (
            <button
              type='button'
              className='rounded-1 btn btn--with-img btn-outline-primary ripple fw-bold'
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img
                loading='lazy'
                className='social-img me-2 rounded-circle'
                src='https://img.icons8.com/color/48/000000/google-logo.png'
                alt='Google'
              />
              {t('continueWithGoogle')}
            </button>
          )}
        />
      </GoogleOAuthProvider>
    </>
  )
}

export default SocialForm

import { useState, useCallback } from 'react'
import { getToken, sendConfirmationEmail } from '../../apis/auth.api'
import Loading from '../ui/Loading'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const EmailActiveButton = ({
  email = '',
  isEmailActive = false,
  googleId = ''
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleSendEmail = useCallback(async () => {
    setError('')
    setIsLoading(true)
    const { _id, accessToken } = getToken()

    try {
      const data = await sendConfirmationEmail(_id, accessToken)
      if (data.error) {
        setError(data.error)
      } else {
        toast.success(t('userDetail.sentVerifyEmailSuccess'))
      }
    } catch {
      setError(t('error.server'))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  return (
    <div className='d-inline-flex flex-column'>
      {email && isEmailActive && (
        <div className='position-relative d-inline-block'>
          <span
            className='badge text-success cus-tooltip rounded-1 bg-success-rgba'
            aria-label={t('verified')}
          >
            <i
              className='fa-regular fa-circle-check me-2'
              aria-hidden='true'
            ></i>
            {t('verified')}
          </span>
          <small className='cus-tooltip-msg'>Email {t('verified')}</small>
        </div>
      )}

      {googleId && (
        <div className='position-relative d-inline-block'>
          <span
            className='badge bg-primary d-inline-flex align-items-end cus-tooltip'
            aria-label='Linked with Google'
          >
            <img
              loading='lazy'
              className='social-img rounded-circle me-1 social-img--small'
              src='https://img.icons8.com/color/48/000000/google-logo.png'
              alt='Google logo'
            />
            linked
          </span>
          <small className='cus-tooltip-msg'>
            {t('userDetail.nonEditEmail')}
          </small>
        </div>
      )}

      {email && !isEmailActive && (
        <div className='position-relative d-inline-block'>
          {isLoading && <Loading size='small' />}
          <button
            className='btn btn-warning btn-sm text-white cus-tooltip ripple'
            onClick={handleSendEmail}
            disabled={isLoading}
            aria-label={t('verifyNow')}
          >
            <i className='fa-solid fa-envelope me-2' aria-hidden='true'></i>
            {t('verifyNow')}!
          </button>
          <small className='cus-tooltip-msg'>{t('confirmEmail')}</small>
          {error && <Error msg={error} />}
        </div>
      )}
    </div>
  )
}

export default EmailActiveButton

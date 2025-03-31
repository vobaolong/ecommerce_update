import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { signin, setToken, forgotPassword } from '../../../apis/auth.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import SocialForm from './SocialForm'

const SigninForm = ({ onSwap = () => {} }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [account, setAccount] = useState({
    username: '',
    password: '',
    isValidUsername: true,
    isValidPassword: true
  })

  const handleChange = useCallback((name, isValidName, value) => {
    setAccount((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setAccount((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const { username, password } = account

      if (!username || !password) {
        setAccount((prev) => ({
          ...prev,
          isValidUsername:
            regexTest('email', username) || regexTest('phone', username),
          isValidPassword: regexTest('password', password)
        }))
        return
      }

      if (!account.isValidUsername || !account.isValidPassword) return

      const user = { password }
      if (regexTest('email', username)) user.email = username
      if (regexTest('phone', username)) user.phone = username

      setIsLoading(true)
      setError('')
      try {
        const data = await signin(user)
        if (data.error) throw new Error(data.error)
        const { accessToken, refreshToken, _id, role } = data
        setToken({ accessToken, refreshToken, _id, role }, () => {
          navigate(role === 'admin' ? '/admin/dashboard' : 0)
          toast.success(t('toastSuccess.signIn'))
        })
      } catch (err) {
        setError(err.message || 'Server error')
      } finally {
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      }
    },
    [account, navigate, t]
  )

  const handleForgotPassword = useCallback(async () => {
    const { username } = account

    if (!username) {
      setAccount((prev) => ({
        ...prev,
        isValidUsername:
          regexTest('email', username) || regexTest('phone', username)
      }))
      return
    }

    if (!account.isValidUsername) return

    if (regexTest('phone', username)) {
      setError(t('notAvailable'))
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const data = await forgotPassword({ email: username })
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.signIn'))
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 5000)
    }
  }, [account, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      <form className='mb-2 row' onSubmit={handleFormSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('signInForm.emailLabel')}
            value={account.username}
            isValid={account.isValidUsername}
            feedback={t('signInForm.emailFeedback')}
            validator='email|phone'
            required
            placeholder={t('emailOrPhonePlaceholder')}
            onChange={(value) =>
              handleChange('username', 'isValidUsername', value)
            }
            onValidate={(flag) => handleValidate('isValidUsername', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('signInForm.passwordLabel')}
            value={account.password}
            isValid={account.isValidPassword}
            feedback={t('signInForm.passwordFeedback')}
            validator='password'
            required
            onChange={(value) =>
              handleChange('password', 'isValidPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidPassword', flag)}
          />
        </div>
        {error && (
          <div className='col-12 mt-3'>
            <Error msg={error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button
            type='submit'
            className='btn btn-primary ripple fw-bold rounded-1'
          >
            {t('button.signIn')}
          </button>
        </div>
        <div className='col-12 mt-4 cus-decoration-paragraph'>
          <p className='text-center text-muted cus-decoration-paragraph-p unselect text-uppercase'>
            {t('or')}
          </p>
        </div>
        <div className='col-12 d-grid gap-2 mt-4'>
          <SocialForm />
        </div>
        <div className='col-12 mt-4 text-center'>
          <small className='d-block text-muted'>
            {t('button.forgotPW')}?{' '}
            <span
              className='pointer text-primary text-decoration-underline'
              onClick={handleForgotPassword}
            >
              {t('button.sendEmail')}
            </span>
          </small>
          <small className='d-block text-muted'>
            {t('signInForm.dontHaveAccount')}{' '}
            <span
              className='text-primary pointer text-decoration-underline'
              onClick={onSwap}
            >
              {t('button.signUp')}
            </span>
          </small>
        </div>
      </form>
    </div>
  )
}

export default SigninForm

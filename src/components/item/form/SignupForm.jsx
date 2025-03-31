import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../../apis/auth.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import SocialForm from './SocialForm'
import { toast } from 'react-toastify'

const SignupForm = ({ onSwap = () => {} }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isValidPasswordConfirmation, setIsValidPasswordConfirmation] =
    useState(true)
  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    isValidFirstName: true,
    isValidLastName: true,
    isValidUsername: true,
    isValidPassword: true
  })
  const navigate = useNavigate()

  const handleChange = useCallback((name, isValidName, value) => {
    setError('')
    setAccount((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setError('')
    setAccount((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleChangePasswordConfirmation = useCallback((value) => {
    setPasswordConfirmation(value)
  }, [])

  const handleValidatePasswordConfirmation = useCallback((flag) => {
    setIsValidPasswordConfirmation(flag)
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { firstName, lastName, username, password } = account

      if (password !== passwordConfirmation) {
        setError(t('passwordMismatch'))
        return
      }

      if (
        !firstName ||
        !lastName ||
        !username ||
        !password ||
        !passwordConfirmation
      ) {
        setAccount((prev) => ({
          ...prev,
          isValidFirstName: regexTest('name', firstName),
          isValidLastName: regexTest('name', lastName),
          isValidUsername:
            regexTest('email', username) || regexTest('phone', username),
          isValidPassword: regexTest('password', password)
        }))
        return
      }

      if (
        !account.isValidFirstName ||
        !account.isValidLastName ||
        !account.isValidUsername ||
        !account.isValidPassword ||
        !isValidPasswordConfirmation
      )
        return

      setIsConfirming(true)
    },
    [account, passwordConfirmation, isValidPasswordConfirmation, t]
  )

  const onSignupSubmit = useCallback(async () => {
    const { firstName, lastName, username, password } = account
    const user = { firstName, lastName, password }
    if (regexTest('email', username)) user.email = username
    if (regexTest('phone', username)) user.phone = username

    setIsLoading(true)
    setError('')
    try {
      const data = await signup(user)
      if (data.error) throw new Error(data.error)
      setAccount({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        isValidFirstName: true,
        isValidLastName: true,
        isValidUsername: true,
        isValidPassword: true
      })
      setPasswordConfirmation('')
      toast.success(t('toastSuccess.signUp'))
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [account, t, navigate])

  return (
    <div className='sign-up-form-wrap position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.signUp')}
          message={
            <small>
              <span className='text-muted'>{t('signInForm.agreeBy')} </span>
              <Link to='/legal/privacy' target='_blank'>
                {t('footer.policy')}
              </Link>
            </small>
          }
          onSubmit={onSignupSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <form className='sign-up-form mb-2 row' onSubmit={handleSubmit}>
        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.firstName')}
            value={account.firstName}
            isValid={account.isValidFirstName}
            feedback={t('userDetail.validFirstName')}
            placeholder='Nguyen Van'
            required
            validator='name'
            onChange={(value) =>
              handleChange('firstName', 'isValidFirstName', value)
            }
            onValidate={(flag) => handleValidate('isValidFirstName', flag)}
          />
        </div>
        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.lastName')}
            value={account.lastName}
            isValid={account.isValidLastName}
            feedback={t('userDetail.validLastName')}
            placeholder='A'
            required
            validator='name'
            onChange={(value) =>
              handleChange('lastName', 'isValidLastName', value)
            }
            onValidate={(flag) => handleValidate('isValidLastName', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
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
            hasEditBtn
            value={account.password}
            isValid={account.isValidPassword}
            feedback={t('passwordFeedback')}
            validator='password'
            required
            onChange={(value) =>
              handleChange('password', 'isValidPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidPassword', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('confirmPw')}
            value={passwordConfirmation}
            isValid={isValidPasswordConfirmation}
            feedback={t('passwordFeedback')}
            validator='password'
            required
            onChange={handleChangePasswordConfirmation}
            onValidate={handleValidatePasswordConfirmation}
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
            {t('button.signUp')}
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
          <small className='text-muted'>
            {t('signInForm.haveAnAccount')}{' '}
            <span
              className='text-primary text-decoration-underline pointer'
              onClick={onSwap}
            >
              {t('button.signIn')}
            </span>
          </small>
          <br />
          <small className='d-block mx-4 mt-1'>
            <span className='text-muted'>{t('signInForm.agreeBy')} </span>
            <Link className='text-primary' to='/legal/privacy' target='_blank'>
              {t('footer.policy')}
            </Link>
          </small>
        </div>
      </form>
    </div>
  )
}

export default SignupForm

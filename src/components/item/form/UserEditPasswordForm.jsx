import { useState, useCallback, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updatePassword } from '../../../apis/user.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const UserEditPasswordForm = () => {
  const { t } = useTranslation()
  const [state, setState] = useState({
    isLoading: false,
    isConfirming: false,
    error: '',
    account: {
      currentPassword: '',
      newPassword: '',
      isValidCurrentPassword: true,
      isValidNewPassword: true
    }
  })
  const { _id, accessToken } = getToken()

  const handleChange = useCallback((name, isValidName, value) => {
    setState((prev) => ({
      ...prev,
      account: { ...prev.account, [name]: value, [isValidName]: true }
    }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setState((prev) => ({
      ...prev,
      account: { ...prev.account, [isValidName]: flag }
    }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { currentPassword, newPassword } = state.account

      if (!currentPassword || !newPassword) {
        setState((prev) => ({
          ...prev,
          account: {
            ...prev.account,
            isValidCurrentPassword: regexTest('password', currentPassword),
            isValidNewPassword: regexTest('password', newPassword)
          }
        }))
        return
      }

      if (
        !state.account.isValidCurrentPassword ||
        !state.account.isValidNewPassword
      )
        return

      setState((prev) => ({ ...prev, isConfirming: true }))
    },
    [state.account]
  )

  const onSubmit = useCallback(async () => {
    const { currentPassword, newPassword } = state.account
    const user = { currentPassword, newPassword }

    setState((prev) => ({ ...prev, error: '', isLoading: true }))
    try {
      const data = await updatePassword(_id, accessToken, user)
      if (data.error) throw new Error(data.error)
      setState({
        isLoading: false,
        isConfirming: false,
        error: '',
        account: {
          currentPassword: '',
          newPassword: '',
          isValidCurrentPassword: true,
          isValidNewPassword: true
        }
      })
      toast.success(t('toastSuccess.userDetail.updatePassword'))
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message, isLoading: false }))
    }
  }, [_id, accessToken, state.account, t])

  useEffect(() => {
    if (state.error) {
      const timeoutId = setTimeout(
        () => setState((prev) => ({ ...prev, error: '' })),
        3000
      )
      return () => clearTimeout(timeoutId)
    }
  }, [state.error])

  return (
    <div className='position-relative'>
      {state.isLoading && <Loading />}
      {state.isConfirming && (
        <ConfirmDialog
          title={t('userDetail.changePassword')}
          onSubmit={onSubmit}
          onClose={() => setState((prev) => ({ ...prev, isConfirming: false }))}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='password'
            label={t('userDetail.currentPw')}
            value={state.account.currentPassword}
            isValid={state.account.isValidCurrentPassword}
            feedback={t('userDetail.pwValid')}
            validator='password'
            required
            onChange={(value) =>
              handleChange('currentPassword', 'isValidCurrentPassword', value)
            }
            onValidate={(flag) =>
              handleValidate('isValidCurrentPassword', flag)
            }
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('userDetail.newPw')}
            value={state.account.newPassword}
            isValid={state.account.isValidNewPassword}
            feedback={t('passwordFeedback')}
            validator='password'
            required
            onChange={(value) =>
              handleChange('newPassword', 'isValidNewPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidNewPassword', flag)}
          />
        </div>
        {state.error && (
          <div className='col-12 mt-3'>
            <Error msg={state.error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserEditPasswordForm

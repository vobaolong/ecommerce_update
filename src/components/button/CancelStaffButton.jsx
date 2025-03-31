import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { cancelStaff } from '../../apis/store.api'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const CancelStaffButton = ({ storeId = '' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const { _id, accessToken } = getToken()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleCancelStaff = useCallback(() => setIsConfirming(true), [])

  const handleSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await cancelStaff(_id, accessToken, storeId)
      if (data.error) throw new Error(data.error)
      toast.success(t('staffDetail.leaveSuccess'))
      navigate(0)
    } catch (err) {
      setError(err.message || t('error.server'))
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, storeId, navigate, t])

  return (
    <div className='position-relative d-inline-block'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={t('staffDetail.leave')}
          color='danger'
          onSubmit={handleSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <button
        type='button'
        className='btn btn-outline-danger rounded-1 ripple'
        onClick={handleCancelStaff}
        disabled={isLoading}
        aria-label={t('staffDetail.leave')}
      >
        <i className='fa-solid fa-ban' aria-hidden='true'></i>
        <span className='ms-2 res-hide'>{t('staffDetail.leave')}</span>
      </button>
    </div>
  )
}

export default CancelStaffButton

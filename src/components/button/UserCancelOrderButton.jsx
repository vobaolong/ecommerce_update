import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import { userCancelOrder } from '../../apis/order.api'
import { calcTime } from '../../helper/calcTime'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../ui/Feedback'
import { socketId } from '../../utils/socket'

const UserCancelOrderButton = ({
  orderId = '',
  status = '',
  detail = true,
  createdAt = '',
  onRun
}) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const { _id, accessToken } = getToken()

  const handleCancelOrder = () => {
    setIsConfirming(true)
  }

  const onSubmit = () => {
    setError('')
    setIsLoading(true)
    const value = { status: 'Cancelled' }
    userCancelOrder(_id, accessToken, value, orderId)
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setTimeout(() => {
            setError('')
          }, 3000)
        } else {
          socketId.emit('notificationCancel', {
            objectId: data.order._id,
            from: _id,
            to: data.order.storeId._id
          })
          toast.success(t('toastSuccess.order.cancel'))
          if (onRun) onRun()
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title='Cancel Order'
          color='danger'
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <div className='d-inline-block cus-tooltip'>
        <button
          type='button'
          className='btn btn-outline-danger ripple rounded-1'
          disabled={status !== 'Not processed' || calcTime(createdAt) >= 1}
          onClick={handleCancelOrder}
        >
          <i className='fa-solid fa-ban'></i>
          {detail && <span className='ms-2'>{t('button.cancel')}</span>}
        </button>
      </div>

      {(!status === 'Not processed' || calcTime(createdAt) >= 1) && (
        <small className='cus-tooltip-msg'>{t('status.cantCancelOrder')}</small>
      )}
    </div>
  )
}

export default UserCancelOrderButton

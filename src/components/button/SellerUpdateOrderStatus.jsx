import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { sellerUpdateStatusOrder } from '../../apis/order.api'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import DropDownMenu from '../ui/DropDownMenu'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { socketId } from '../../utils/socket'

const SellerUpdateOrderStatus = ({
  storeId = '',
  orderId = '',
  status = '',
  onRun
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [statusValue, setStatusValue] = useState(status)
  const { _id, accessToken } = getToken()
  const { t } = useTranslation()

  useEffect(() => {
    setStatusValue(status)
  }, [status])

  const getStatusOptions = useCallback(() => {
    const options = [
      { label: t('status.notProcessed'), value: 'Not processed' },
      { label: t('status.processing'), value: 'Processing' },
      { label: t('status.shipped'), value: 'Shipped' },
      { label: t('status.delivered'), value: 'Delivered' },
      { label: t('status.cancel'), value: 'Cancelled' }
    ]

    const filters = {
      'Not processed': ['Shipped', 'Delivered', 'Not processed'],
      Processing: ['Not processed', 'Delivered', 'Processing'],
      Shipped: ['Not processed', 'Processing', 'Shipped', 'Cancelled'],
      Delivered: [statusValue],
      Cancelled: [statusValue]
    }

    return options.filter(
      (option) => !filters[statusValue]?.includes(option.value)
    )
  }, [statusValue, t])

  const handleUpdate = useCallback((value) => {
    setStatusValue(value)
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    const value = { status: statusValue }

    try {
      const data = await sellerUpdateStatusOrder(
        _id,
        accessToken,
        value,
        orderId,
        storeId
      )
      if (data.error) throw new Error(data.error)
      if (statusValue === 'Delivered') {
        socketId.emit('notificationDelivered', {
          objectId: data.order._id,
          from: _id,
          to: data.order.userId._id ?? data.order.userId
        })
      }
      toast.success(t('toastSuccess.order.update'))
      onRun?.()
    } catch (err) {
      setError(err.message || 'Server Error')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, orderId, storeId, statusValue, onRun, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.updateOrder')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <DropDownMenu
        listItem={getStatusOptions()}
        size='lg'
        value={{
          label: t(`status.${statusValue.toLowerCase().replace(' ', '')}`),
          value: statusValue
        }}
        setValue={(item) => handleUpdate(item.value)}
        borderBtn={false}
      />
    </div>
  )
}

export default SellerUpdateOrderStatus

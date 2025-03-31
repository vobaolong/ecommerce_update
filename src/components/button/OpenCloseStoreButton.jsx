import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { openStore } from '../../apis/store.api'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const OpenCloseStoreButton = ({ storeId = '', isOpen = true, onRun }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const { _id, accessToken } = getToken()
  const { t } = useTranslation()

  const handleOpenStore = useCallback(() => {
    setIsConfirming(true)
  }, [])

  const handleSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    const newOpenState = !isOpen
    const value = { isOpen: newOpenState }

    try {
      const data = await openStore(_id, accessToken, value, storeId)
      if (data.error) {
        setError(data.error)
      } else {
        if (onRun) onRun(data.store)
        toast.success(
          t(
            newOpenState ? 'toastSuccess.unlockStore' : 'toastSuccess.lockStore'
          )
        )
      }
    } catch {
      setError(t('error.server'))
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, storeId, isOpen, onRun, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading size='small' />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={isOpen ? t('title.closeStore') : t('title.openStore')}
          onSubmit={handleSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <div className='form-check form-switch'>
        <input
          type='checkbox'
          className='form-check-input'
          checked={isOpen}
          onChange={handleOpenStore}
          disabled={isLoading}
          aria-label={isOpen ? t('title.closeStore') : t('title.openStore')}
        />
      </div>
    </div>
  )
}

export default OpenCloseStoreButton

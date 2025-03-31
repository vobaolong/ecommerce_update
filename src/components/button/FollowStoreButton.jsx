import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { followStore, unfollowStore } from '../../apis/follow.api'
import Loading from '../ui/Loading'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const FollowStoreButton = ({
  storeId = '',
  isFollowing = false,
  className = '',
  onRun
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { _id, accessToken } = getToken()
  const { t } = useTranslation()

  const handleFollowStore = useCallback(async () => {
    setError('')
    setIsLoading(true)

    const apiCall = isFollowing ? unfollowStore : followStore

    try {
      const data = await apiCall(_id, accessToken, storeId)
      if (data.error) {
        setError(data.error)
      } else {
        const newFollowingState = !isFollowing
        if (onRun) {
          data.store.isFollowing = newFollowingState
          onRun(data.store)
        }
        toast.success(
          t(
            `toastSuccess.followStore.${
              newFollowingState ? 'follow' : 'unfollow'
            }`
          )
        )
      }
    } catch {
      setError(t('error.server'))
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, storeId, isFollowing, onRun, t])

  return (
    <button
      type='button'
      className={`btn rounded-1 ${
        isFollowing ? 'btn-danger' : 'btn-outline-danger'
      } ripple ${className}`}
      onClick={handleFollowStore}
      disabled={isLoading}
      aria-label={
        isFollowing ? t('storeDetail.unfollow') : t('storeDetail.follow')
      }
    >
      {isLoading && <Loading size='small' />}
      {error ? (
        <Error msg={error} />
      ) : isFollowing ? (
        <>
          <i className='fa-solid fa-check' aria-hidden='true'></i>
          <span className='ms-2 res-hide-md'>{t('storeDetail.following')}</span>
        </>
      ) : (
        <>
          <i className='fa-light fa-plus' aria-hidden='true'></i>
          <span className='ms-2 res-hide-md'>{t('storeDetail.follow')}</span>
        </>
      )}
    </button>
  )
}

export default FollowStoreButton

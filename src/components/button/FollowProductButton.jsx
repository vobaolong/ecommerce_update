import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { followProduct, unfollowProduct } from '../../apis/follow.api'
import Loading from '../ui/Loading'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const FollowProductButton = ({
  productId = '',
  isFollowing = false,
  className = '',
  style = {},
  onRun
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { _id, accessToken } = getToken()
  const { t } = useTranslation()

  const handleFollowProduct = useCallback(async () => {
    setError('')
    setIsLoading(true)

    const apiCall = isFollowing ? unfollowProduct : followProduct

    try {
      const data = await apiCall(_id, accessToken, productId)
      if (data.error) {
        setError(data.error)
      } else {
        const newFollowingState = !isFollowing
        if (onRun) {
          data.product.isFollowing = newFollowingState
          onRun(data.product)
        }
        toast.success(
          t(
            `toastSuccess.followProduct.${
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
  }, [_id, accessToken, productId, isFollowing, onRun, t])

  return (
    <div className='d-grid' style={style}>
      <span
        className={`d-flex align-items-center rounded-circle justify-content-center position-relative ${
          isFollowing ? 'text-danger' : 'text-secondary'
        } ${className}`}
        onClick={handleFollowProduct}
        role='button'
        aria-label={isFollowing ? t('unfollow') : t('follow')}
      >
        {isLoading && <Loading size='small' />}
        {error && <Error msg={error} />}
        <i
          className={`pointer fa-heart p-2 rounded-circle box-shadow ${
            isFollowing
              ? 'bg-danger text-white fa-solid'
              : 'bg-white fa-regular'
          }`}
          style={{ fontSize: '17px' }}
          aria-hidden='true'
        ></i>
      </span>
    </div>
  )
}

export default FollowProductButton

import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { removeReview } from '../../apis/review.api'
import StarRating from '../label/StarRating'
import ProductSmallCard from '../card/ProductSmallCard'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import EditReviewItem from '../item/EditReviewItem'
import Error from '../ui/Feedback'
import { readableDate } from '../../helper/readable'
import { calcTime } from '../../helper/calcTime'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const ReviewInfo = ({ review = {}, about = true, onRun }) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { t } = useTranslation()

  const hoursDifference = calcTime(review?.orderId?.updatedAt)
  const isReviewAllowed = hoursDifference < 720 // 30 days
  const currentUserId = getToken()?._id
  const isOwner = currentUserId === review.userId?._id

  const handleMenuToggle = useCallback(() => {
    setShowMenu((prev) => !prev)
  }, [])

  const handleRemove = useCallback(() => {
    if (!isReviewAllowed) return
    setIsConfirming(true)
  }, [isReviewAllowed])

  const handleRemoveReview = useCallback(async () => {
    const { _id, accessToken } = getToken()
    setError('')
    setIsLoading(true)

    try {
      const data = await removeReview(_id, accessToken, review._id)
      if (data.error) {
        setError(data.error)
        setTimeout(() => setError(''), 3000)
      } else {
        onRun?.()
        toast.success(t('toastSuccess.review.delete'))
      }
    } catch {
      setError('Server error')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }, [review._id, onRun, t])

  return (
    <div className='row py-2 border-bottom position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={t('reviewDetail.delete')}
          message={t('message.delete')}
          onSubmit={handleRemoveReview}
          onClose={() => setIsConfirming(false)}
          color='danger'
        />
      )}

      <div className='col-12 px-1 d-flex justify-content-between align-items-center'>
        <div className='d-flex justify-content-between flex-grow-1'>
          <small className='d-inline-flex gap-2 align-items-center'>
            <StarRating stars={review.rating} />
            <small className='text-secondary'>
              {review.rating === 5
                ? t('reviewDetail.amazing')
                : review.rating === 4
                ? t('reviewDetail.good')
                : review.rating === 3
                ? t('reviewDetail.fair')
                : review.rating === 2
                ? t('reviewDetail.poor')
                : t('reviewDetail.terrible')}
            </small>
            <span className='text-primary fw-medium'>
              {review?.userId?.firstName} {review?.userId?.lastName}
            </span>
            <span className='text-success rounded-1 px-1 bg-success-rgba my-auto'>
              <i className='fa-regular fa-circle-check'></i>{' '}
              {t('productDetail.purchased')}
            </span>
            {about && (
              <ProductSmallCard borderName product={review.productId} />
            )}
          </small>
          <span style={{ fontSize: '0.8rem', color: '#555' }}>
            {readableDate(review.createdAt)}
          </span>
        </div>
      </div>

      <div className='col-10 mt-1 px-1'>
        <span style={{ fontSize: '0.9rem' }}>{review.content}</span>
      </div>

      {isOwner && isReviewAllowed && (
        <div className='col-2 d-flex justify-content-end align-items-end mt-1 px-1'>
          <div className='menu-container position-relative'>
            <button className='btn menu-button' onClick={handleMenuToggle}>
              <i className='fa fa-ellipsis-v'></i>
            </button>
            {showMenu && (
              <div className='menu d-flex flex-column gap-2 align-items-start p-2 position-absolute bg-white shadow-sm rounded'>
                <EditReviewItem oldReview={review} onRun={onRun} />
                <hr className='m-0 w-100' />
                <button
                  type='button'
                  className='btn rounded-1 btn-sm ripple rm-review w-100 text-start text-danger'
                  onClick={handleRemove}
                >
                  <i className='fa-solid fa-trash-alt me-2'></i>
                  {t('reviewDetail.delete')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewInfo

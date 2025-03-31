/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Fragment } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addSeller } from '../../slices/sellerSlice'
import { getToken } from '../../apis/auth.api'
import { getStoreProfile } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { getNumberOfFollowers } from '../../apis/follow.api'
import { countOrder } from '../../apis/order.api'
import Loading from '../ui/Loading'
import Error from '../ui/Feedback'
import { useTranslation } from 'react-i18next'
import defaultImage from '../../assets/default.webp'

const IMG = import.meta.env.VITE_STATIC_URL

const SellerInit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirect, setRedirect] = useState(false)
  const store = useSelector((state) => state.seller.store)
  const dispatch = useDispatch()
  const { _id, accessToken } = getToken()
  const { storeId } = useParams()
  const { t } = useTranslation()

  const init = async () => {
    setIsLoading(true)
    setError('')
    try {
      const {
        store: storeData,
        error,
        isManager
      } = await getStoreProfile(_id, accessToken, storeId)
      if (error)
        return isManager === false ? setRedirect(true) : setError(error)

      const newStore = { ...storeData }
      const [level, followers, delivered, cancelled] = await Promise.all([
        getStoreLevel(storeId)
          .then((res) => res.level)
          .catch(() => ({})),
        getNumberOfFollowers(storeId)
          .then((res) => res.count)
          .catch(() => 0),
        countOrder('Delivered', '', storeId)
          .then((res) => res.count)
          .catch(() => 0),
        countOrder('Cancelled', '', storeId)
          .then((res) => res.count)
          .catch(() => 0)
      ])

      newStore.level = level
      newStore.numberOfFollowers = followers
      newStore.numberOfSuccessfulOrders = delivered
      newStore.numberOfFailedOrders = cancelled

      dispatch(addSeller(newStore))
    } catch {
      setError('Server error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!store || store._id !== storeId) init()
  }, [storeId])

  return (
    <Fragment>
      {redirect && <Navigate to='/' />}
      {isLoading ? (
        <div className='cus-position-relative-loading'>
          <Loading size='small' />
        </div>
      ) : (
        <div className='your-store-wrap'>
          <div className='your-store'>
            <div className='your-store-card btn lang ripple'>
              <img
                loading='lazy'
                src={store.avatar ? `${IMG}${store.avatar}` : defaultImage}
                className='your-store-img'
                alt={store.name}
              />
              <span className='your-store-name unselect res-hide-xl'>
                {error ? <Error msg={error} /> : store.name}
              </span>
            </div>
            <ul
              className='list-group your-store-options p-3 bg-white fw-normal'
              style={{ left: '10%' }}
            >
              <div className='d-flex align-items-start default'>
                <img
                  loading='lazy'
                  src={store.avatar ? `${IMG}${store.avatar}` : defaultImage}
                  className='your-account-img'
                  style={{ width: '35px', height: '35px' }}
                  alt={store.name}
                />
                <span className='ms-2 d-flex flex-column'>
                  <span className='text-primary fw-bold'>{store.name}</span>
                  <small className='text-secondary'>
                    {store.ownerId?.email}
                  </small>
                </span>
              </div>
              <hr className='my-2' />
              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0'
                to={`/seller/profile/${storeId}`}
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-store'></i>
                {t('storeDetail.profile')}
              </Link>
              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0 mt-2'
                to={`/seller/orders/${storeId}`}
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-receipt'></i>
                {t('storeDetail.orders')}
              </Link>
              <hr className='my-2' />
              <Link
                className='list-group-item your-store-options-item ripple rounded-1 bg-value border-0 mt-2'
                to='/account/store'
              >
                <i className='fw-normal text-primary fs-9 fa-light fa-angle-left'></i>
                {t('button.back')}
              </Link>
            </ul>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default SellerInit

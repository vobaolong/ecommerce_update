/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addStore } from '../../slices/storeSlice'
import { getToken } from '../../apis/auth.api'
import { getStore } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { countOrder } from '../../apis/order.api'
import {
  getNumberOfFollowers,
  checkFollowingStore
} from '../../apis/follow.api'
import Error from '../ui/Feedback'
import Loading from '../ui/Loading'

const IMG = import.meta.env.VITE_STATIC_URL

const StoreInit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const store = useSelector((state) => state.store.store)
  const { _id, accessToken } = getToken()
  const { storeId } = useParams()

  const init = async () => {
    setIsLoading(true)
    try {
      const data = await getStore(storeId)
      if (data.error) {
        setError(data.error)
        return
      }

      const newStore = data.store

      const [
        levelData,
        followersData,
        followingData,
        successOrders,
        failedOrders
      ] = await Promise.allSettled([
        getStoreLevel(storeId),
        getNumberOfFollowers(storeId),
        checkFollowingStore(_id, accessToken, storeId),
        countOrder('Delivered', '', storeId),
        countOrder('Cancelled', '', storeId)
      ])

      newStore.level =
        levelData.status === 'fulfilled' ? levelData.value.level : {}
      newStore.numberOfFollowers =
        followersData.status === 'fulfilled' ? followersData.value.count : 0
      newStore.isFollowing =
        followingData.status === 'fulfilled'
          ? followingData.value.success
          : false
      newStore.numberOfSuccessfulOrders =
        successOrders.status === 'fulfilled' ? successOrders.value.count : 0
      newStore.numberOfFailedOrders =
        failedOrders.status === 'fulfilled' ? failedOrders.value.count : 0

      dispatch(addStore(newStore))
    } catch {
      setError('Server Error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!store || store._id !== storeId) init()
  }, [storeId])

  if (isLoading) {
    return (
      <div className='cus-position-relative-loading'>
        <Loading size='small' />
      </div>
    )
  }

  return (
    <div
      type='button'
      className='your-store-card btn btn-outline-light cus-outline ripple'
    >
      <img
        loading='lazy'
        src={`${IMG + store?.avatar}`}
        className='your-store-img'
        alt='Store avatar'
      />
      <span className='your-store-name unselect res-hide-md'>
        {store?.name}
        {error && <Error msg={error} />}
      </span>
    </div>
  )
}

export default StoreInit

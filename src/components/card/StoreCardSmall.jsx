/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  getNumberOfFollowers,
  checkFollowingStore
} from '../../apis/follow.api'
import { getStoreLevel } from '../../apis/level.api'
import FollowStoreButton from '../button/FollowStoreButton'
import defaultImage from '../../assets/default.webp'
import Skeleton from 'react-loading-skeleton'

const IMG = import.meta.env.VITE_STATIC_URL

const StoreCardSmall = ({ isLoading = false, store = {}, onRun }) => {
  const [storeValue, setStoreValue] = useState({})

  const fetchStoreData = useCallback(async () => {
    const newStore = { ...store }
    const { _id, accessToken } = getToken()

    try {
      const levelData = await getStoreLevel(store._id)
      newStore.level = levelData.level
    } catch {
      newStore.level = store.level || 0
    }

    try {
      const followersData = await getNumberOfFollowers(store._id)
      newStore.numberOfFollowers = followersData.count
    } catch {
      newStore.numberOfFollowers = 0
    }

    try {
      const followData = await checkFollowingStore(_id, accessToken, store._id)
      newStore.isFollowing = followData.success
    } catch {
      newStore.isFollowing = false
    }

    setStoreValue(newStore)
  }, [store._id])

  useEffect(() => {
    if (!isLoading) {
      fetchStoreData()
    }
  }, [fetchStoreData, isLoading])

  const handleFollowUpdate = useCallback(
    async (newStore) => {
      onRun?.(newStore)

      try {
        const followersData = await getNumberOfFollowers(newStore._id)
        setStoreValue((prev) => ({
          ...prev,
          numberOfFollowers: followersData.count
        }))
      } catch {
        setStoreValue((prev) => ({
          ...prev,
          numberOfFollowers: newStore.isFollowing
            ? prev.numberOfFollowers + 1
            : prev.numberOfFollowers - 1
        }))
      }
    },
    [onRun]
  )

  return (
    <div className='card-small border-0 bg-body rounded-2 w-100'>
      {isLoading ? (
        <Skeleton height={150} />
      ) : (
        <Link
          className='text-reset text-decoration-none'
          to={`/store/${storeValue._id}`}
          title={storeValue.name}
        >
          <div className='card-img-top cus-card-img-top-small'>
            <img
              loading='lazy'
              src={
                storeValue.avatar ? `${IMG}${storeValue.avatar}` : defaultImage
              }
              className='cus-card-img-small'
              alt={storeValue.name}
            />
          </div>
        </Link>
      )}

      <div className='card-body border-top border-value'>
        {isLoading ? (
          <Skeleton height={40} />
        ) : (
          <small className='card-subtitle d-flex justify-content-between align-items-center'>
            {getToken() && (
              <FollowStoreButton
                storeId={store._id}
                isFollowing={storeValue.isFollowing}
                className='w-70'
                onRun={handleFollowUpdate}
              />
            )}
            <label className='btn w-25 btn-group border rounded-1 justify-content-center'>
              {storeValue.numberOfFollowers || 0}
            </label>
          </small>
        )}
      </div>
    </div>
  )
}

export default StoreCardSmall

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getNumberOfFollowers, checkFollowingStore } from '../apis/follow.api'
import { getUserLevel, getStoreLevel } from '../apis/level.api'
import { countOrder } from '../apis/order.api'
import { getCartCount } from '../apis/cart.api'
import { getToken } from '../apis/auth.api'

const useUpdateDispatch = () => {
  const account = useSelector((state) => state.account.user)
  const seller = useSelector((state) => state.seller.store)
  const user = useSelector((state) => state.user.user)
  const store = useSelector((state) => state.store.store)
  const { _id, accessToken } = getToken()

  const getOrderCounts = useCallback(async (userId = '', storeId = '') => {
    try {
      const [delivered, cancelled] = await Promise.all([
        countOrder('Delivered', userId, storeId),
        countOrder('Cancelled', userId, storeId)
      ])
      return {
        numberOfSuccessfulOrders: delivered.count,
        numberOfFailedOrders: cancelled.count
      }
    } catch {
      return null
    }
  }, [])

  const safeApiCall = useCallback(async (apiFn, fallback) => {
    try {
      return await apiFn()
    } catch {
      return fallback
    }
  }, [])

  const updateDispatch = useCallback(
    async (name, data) => {
      const result = { ...data }

      switch (name) {
        case 'account': {
          result.level = (
            await safeApiCall(() => getUserLevel(_id), { level: account.level })
          ).level
          result.cartCount = (
            await safeApiCall(() => getCartCount(_id, accessToken), {
              count: account.cartCount
            })
          ).count
          const orderCounts = (await getOrderCounts(_id)) || {
            numberOfSuccessfulOrders: account.numberOfSuccessfulOrders,
            numberOfFailedOrders: account.numberOfFailedOrders
          }
          return { ...result, ...orderCounts }
        }

        case 'seller':
        case 'store': {
          const storeData = name === 'seller' ? seller : store
          result.level = (
            await safeApiCall(() => getStoreLevel(data._id), {
              level: storeData.level
            })
          ).level
          result.numberOfFollowers = (
            await safeApiCall(() => getNumberOfFollowers(data._id), {
              count: storeData.numberOfFollowers
            })
          ).count

          if (name === 'store') {
            result.isFollowing = (
              await safeApiCall(
                () => checkFollowingStore(_id, accessToken, data._id),
                { success: storeData.isFollowing }
              )
            ).success
          }

          const orderCounts = (await getOrderCounts('', data._id)) || {
            numberOfSuccessfulOrders: storeData.numberOfSuccessfulOrders,
            numberOfFailedOrders: storeData.numberOfFailedOrders
          }
          return { ...result, ...orderCounts }
        }

        case 'user': {
          result.level = (
            await safeApiCall(() => getUserLevel(data._id), {
              level: user.level
            })
          ).level
          const orderCounts = (await getOrderCounts(data._id)) || {
            numberOfSuccessfulOrders: user.numberOfSuccessfulOrders,
            numberOfFailedOrders: user.numberOfFailedOrders
          }
          return { ...result, ...orderCounts }
        }

        case 'product':
          return result

        default:
          return result
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_id, accessToken, account, seller, store, user]
  )

  return [updateDispatch]
}

export default useUpdateDispatch

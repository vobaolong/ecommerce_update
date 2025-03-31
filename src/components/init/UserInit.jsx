/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../ui/Loading'
import { getUserLevel } from '../../apis/level.api'
import { countOrder } from '../../apis/order.api'
import { getUser } from '../../apis/user.api'
import { addUser } from '../../slices/userSlice'

const IMG = import.meta.env.VITE_STATIC_URL

const UserInit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useParams()
  const [error, setError] = useState('')

  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const init = async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await getUser(userId)
      if (data.error) {
        setError(data.error)
        setIsLoading(false)
      } else {
        const newUser = data.user
        try {
          const res = await getUserLevel(userId)
          newUser.level = res.level
        } catch {
          newUser.level = {}
        }

        try {
          const res1 = await countOrder('Delivered', userId, '')
          const res2 = await countOrder('Cancelled', userId, '')
          newUser.numberOfSuccessfulOrders = res1.count
          newUser.numberOfFailedOrders = res2.count
        } catch {
          newUser.numberOfSuccessfulOrders = 0
          newUser.numberOfFailedOrders = 0
        }

        dispatch(addUser(newUser))
        setIsLoading(false)
      }
    } catch {
      setError('Server Error')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user || user._id !== userId) init()
  }, [userId])

  return isLoading ? (
    <div className='cus-position-relative-loading'>
      <Loading size='small' />
    </div>
  ) : error ? (
    <div className='alert alert-danger'>{error}</div>
  ) : user ? (
    <div
      type='button'
      className='your-store-card btn btn-outline-light cus-outline ripple'
    >
      <img
        loading='lazy'
        src={`${IMG + user.avatar}`}
        className='your-store-img'
        alt='avatar'
      />
      <span className='your-store-name unselect'>
        {user.firstName + ' ' + user.lastName}
      </span>
    </div>
  ) : null
}

export default UserInit

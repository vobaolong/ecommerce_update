/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getToken, signout } from '../../apis/auth.api'
import { getUserProfile } from '../../apis/user.api'
import { getUserLevel } from '../../apis/level.api'
import { getCartCount } from '../../apis/cart.api'
import { countOrder } from '../../apis/order.api'
import { addAccount } from '../../slices/accountSlice'
import Error from '../ui/Feedback'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import Loading from '../ui/Loading'
import defaultImage from '../../assets/default.webp'

const IMG = import.meta.env.VITE_STATIC_URL

const AccountInit = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.account.user)
  const { email, firstName, lastName, avatar } = user
  const navigate = useNavigate()
  const { _id, accessToken, refreshToken, role } = getToken()
  const { t } = useTranslation()

  const fetchUserData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { user: profileData } = await getUserProfile(_id, accessToken)
      const newUser = { ...profileData }

      try {
        const { level } = await getUserLevel(_id)
        newUser.level = level
      } catch {
        newUser.level = {}
      }

      try {
        const { count } = await getCartCount(_id, accessToken)
        newUser.cartCount = count
      } catch {
        newUser.cartCount = 0
      }

      try {
        const [delivered, cancelled] = await Promise.all([
          countOrder('Delivered', _id, ''),
          countOrder('Cancelled', _id, '')
        ])
        newUser.numberOfSuccessfulOrders = delivered.count
        newUser.numberOfFailedOrders = cancelled.count
      } catch {
        newUser.numberOfSuccessfulOrders = 0
        newUser.numberOfFailedOrders = 0
      }

      dispatch(addAccount(newUser))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, dispatch])

  useEffect(() => {
    if (!email && !firstName && !lastName && !avatar) {
      fetchUserData()
    }
  }, [fetchUserData])

  const handleSignout = useCallback(() => {
    setIsConfirming(true)
  }, [])

  const onSignoutSubmit = useCallback(() => {
    setIsLoading(true)
    signout(refreshToken, () => {
      navigate(0)
    })
  }, [refreshToken, navigate])

  return isLoading ? (
    <div className='cus-position-relative-loading'>
      <Loading size='small' />
    </div>
  ) : (
    <div className='your-account-wrap'>
      {isConfirming && (
        <ConfirmDialog
          title={t('button.logout')}
          color='danger'
          onSubmit={onSignoutSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {error && <Error msg={error} />}
      <div className='your-account'>
        <div className='your-account-card btn lang ripple rounded-1 inherit'>
          <img
            loading='lazy'
            src={avatar ? `${IMG}${avatar}` : defaultImage}
            className='your-account-img'
            alt={`${firstName} ${lastName}`}
          />
          <span className='your-account-name unselect res-hide-xl'>
            {t('userDetail.account')}
          </span>
        </div>

        <ul className='list-group your-account-options p-3 bg-white'>
          <div className='d-flex align-items-start default'>
            <img
              loading='lazy'
              src={avatar ? `${IMG}${avatar}` : defaultImage}
              className='your-account-img'
              style={{ width: '35px', height: '35px' }}
              alt={`${firstName} ${lastName}`}
            />
            <span className='ms-2 d-flex flex-column'>
              <span className='text-primary fw-bold'>
                {firstName} {lastName}
              </span>
              <small className='text-secondary'>{email}</small>
            </span>
          </div>
          <hr className='my-2' />
          <Link
            className='list-group-item rounded-1 bg-value border-0 your-account-options-item ripple mt-2'
            to='/account/profile'
          >
            <i className='fa-light fw-normal fa-user text-primary fs-9'></i>
            {t('userDetail.myAccount')}
          </Link>
          {role === 'user' && (
            <>
              <Link
                className='list-group-item rounded-1 bg-value border-0 mt-2 your-account-options-item ripple'
                to='/account/store'
              >
                <i className='fa-light fw-normal fa-store text-primary fs-9'></i>
                {t('myStore')}
              </Link>
              <Link
                className='list-group-item rounded-1 bg-value border-0 mt-2 your-account-options-item ripple'
                to='/account/purchase'
              >
                <i className='fa-light fw-normal fa-receipt text-primary fs-9'></i>
                {t('userDetail.myPurchase')}
              </Link>
            </>
          )}
          <hr className='my-2' />
          <li
            className='list-group-item rounded-1 bg-value border-0 mt-2 your-account-options-item ripple'
            onClick={handleSignout}
          >
            <i className='fa-light fw-normal fa-arrow-right-from-bracket text-primary fs-9'></i>
            <span className='text-danger'>{t('button.logout')}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AccountInit

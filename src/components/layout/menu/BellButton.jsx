import { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  deleteNotifications,
  getNotifications,
  updateRead
} from '../../../apis/notification.api'
import { useTranslation } from 'react-i18next'
import { timeAgo } from '../../../helper/calcTime'
import { readableDate } from '../../../helper/readable'
import { socketId } from '../../../utils/socket'

const BellButton = ({ navFor = '' }) => {
  const { t } = useTranslation()
  const [list, setList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const user = useSelector((state) => state.account.user)
  const store = useSelector((state) => state.seller.store)
  const dropdownRef = useRef(null)

  const fetchNotifications = useCallback(async (id) => {
    try {
      const res = await getNotifications(id)
      const sortedNotifications = res.notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setList(sortedNotifications)
      setNotificationCount(res.numberHidden)
    } catch (error) {
      console.error('Fetch notifications error:', error)
    }
  }, [])

  const handleDelete = useCallback(async () => {
    try {
      await deleteNotifications(user._id)
      setList([])
      setNotificationCount(0)
    } catch (error) {
      console.error('Delete notifications error:', error)
    }
  }, [user._id])

  const handleNotificationClick = useCallback(
    async (notificationId) => {
      try {
        await updateRead(user._id)
        setList((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        )
        setNotificationCount((prev) => Math.max(prev - 1, 0))
      } catch (error) {
        console.error('Update read error:', error)
      }
    },
    [user._id]
  )

  useEffect(() => {
    if (user._id) fetchNotifications(user._id)
  }, [user._id, fetchNotifications])

  useEffect(() => {
    socketId.on('notification', (id) => fetchNotifications(id))
    return () => socketId.off('notification')
  }, [fetchNotifications])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getLink = (objectId) => {
    switch (navFor) {
      case 'user':
        return `/account/purchase/detail/${objectId}`
      case 'seller':
        return `/seller/orders/detail/${objectId}/${store._id}`
      case 'admin':
        return '/admin/report'
      default:
        return '#'
    }
  }

  return (
    <div className='position-relative' ref={dropdownRef}>
      <div
        className='cart-item-wrap position-relative'
        onClick={() => {
          setIsOpen(!isOpen)
          setNotificationCount(0)
        }}
      >
        <span className='rounded-circle btn inherit cus-tooltip ripple mx-2 bell'>
          <i className='fa-solid fa-bell'></i>
        </span>
        {notificationCount > 0 && (
          <span
            style={{ top: '20%', left: '80%' }}
            className='position-absolute translate-middle badge rounded-pill bg-danger'
          >
            {notificationCount < 100 ? notificationCount : '99+'}
          </span>
        )}
        <small className='cus-tooltip-msg'>{t('notification')}</small>
      </div>

      {isOpen && (
        <div
          className='position-absolute bg-white shadow rounded-2'
          style={{
            minWidth: '420px',
            maxHeight: '340px',
            top: '100%',
            right: 0,
            zIndex: 1000
          }}
        >
          <div className='text-secondary p-2 px-3'>{t('newNotification')}</div>
          <div style={{ height: '300px', overflow: 'auto' }}>
            {list.length === 0 ? (
              <p className='text-center mt-5 pt-5'>{t('noneNotification')}</p>
            ) : (
              list.map((l) => (
                <Link
                  key={l._id}
                  to={getLink(l.objectId)}
                  className={`d-block nolink px-3 py-2 border-top ${
                    l.isRead ? 'cus-notification-is-read' : 'cus-notification'
                  }`}
                  style={{ fontSize: '14px' }}
                  onClick={() => handleNotificationClick(l._id)}
                >
                  {l.message} <p>{l.objectId}</p>
                  <div className='d-flex justify-content-between'>
                    <span>{timeAgo(l.createdAt)}</span>
                    <small>{readableDate(l.createdAt)}</small>
                  </div>
                </Link>
              ))
            )}
          </div>
          {list.length > 0 && (
            <>
              <hr className='m-0' />
              <button
                className='btn btn-primary w-100 rounded-0'
                onClick={handleDelete}
              >
                {t('deleteAll')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default BellButton

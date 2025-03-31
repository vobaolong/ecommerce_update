import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { getListUsers } from '../../../apis/user.api'
import { addStaff } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import UserSmallCard from '../../card/UserSmallCard'
import SearchInput from '../../ui/SearchInput'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const StoreAddStaffForm = ({ storeId = '', owner = {}, staff = [] }) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'firstName',
    role: 'customer',
    order: 'asc',
    limit: 3,
    page: 1
  })
  const [pagination, setPagination] = useState({})
  const [listUsers, setListUsers] = useState([])
  const [listLeft, setListLeft] = useState([])
  const [listRight, setListRight] = useState([])
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const { _id, accessToken } = getToken()

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getListUsers(filter)
      if (data.error) return
      setPagination({
        size: data.size,
        pageCurrent: data.filter.pageCurrent,
        pageCount: data.filter.pageCount
      })
      setListUsers((prev) =>
        filter.page === 1 ? data.users : [...prev, ...data.users]
      )
    } catch {
      // Silent fail as per original code
    }
  }, [filter])

  useEffect(() => {
    setFilter((prev) => ({ ...prev, page: 1 }))
  }, [storeId, owner, staff])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const staffIds = new Set(staff.map((s) => s._id))
    const rightIds = new Set(listRight.map((r) => r._id))
    setListLeft(
      listUsers.filter(
        (u) =>
          u._id !== owner._id && !staffIds.has(u._id) && !rightIds.has(u._id)
      )
    )
  }, [listUsers, listRight, owner, staff])

  const handleChangeKeyword = useCallback((keyword) => {
    setFilter((prev) => ({ ...prev, search: keyword, page: 1 }))
  }, [])

  const handleLoadMore = useCallback(() => {
    setFilter((prev) => ({ ...prev, page: prev.page + 1 }))
  }, [])

  const handleAddBtn = useCallback((user) => {
    setListRight((prev) => [...prev, user])
    setListLeft((prev) => prev.filter((u) => u._id !== user._id))
  }, [])

  const handleRemoveBtn = useCallback((user) => {
    setListLeft((prev) => [...prev, user])
    setListRight((prev) => prev.filter((u) => u._id !== user._id))
  }, [])

  const handleSubmit = useCallback(() => {
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(async () => {
    const staffIds = listRight.map((r) => r._id)
    setError('')
    setIsLoading(true)
    try {
      const data = await addStaff(_id, accessToken, staffIds, storeId)
      if (data.error) throw new Error(data.error)
      setListRight([])
      updateDispatch('seller', data.store)
      toast.success(t('toastSuccess.staff.addStaff'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, storeId, listRight, updateDispatch, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={t('staffDetail.add')}
          message={t('message.addStaff')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <div className='row'>
        <div className='col'>
          <div
            className='border rounded-1 p-2 bg-light d-flex flex-column justify-content-between'
            style={{ minHeight: '200px' }}
          >
            <SearchInput onChange={handleChangeKeyword} />
            <div className='flex-grow-1 w-100 mt-2'>
              {listLeft.map((user, index) => (
                <div
                  key={index}
                  className='d-flex justify-content-between align-items-center mb-2'
                >
                  <UserSmallCard user={user} />
                  <div className='position-relative d-inline-block'>
                    <button
                      type='button'
                      className='btn btn-primary btn-sm ripple rounded-1 cus-tooltip'
                      onClick={() => handleAddBtn(user)}
                    >
                      <i className='fa-solid fa-user-plus'></i>
                    </button>
                    <span className='cus-tooltip-msg'>{t('button.add')}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type='button'
              disabled={pagination.pageCount <= pagination.pageCurrent}
              className='btn btn-primary ripple w-100 mt-2 rounded-1'
              onClick={handleLoadMore}
            >
              <i className='fa-solid fa-caret-down'></i> {t('button.more')}
            </button>
          </div>
        </div>
        <div className='col'>
          <div
            className='border rounded-1 p-2 bg-light d-flex flex-column justify-content-between'
            style={{ minHeight: '200px' }}
          >
            <div className='flex-grow-1 w-100'>
              {listRight.map((user, index) => (
                <div
                  key={index}
                  className='d-flex justify-content-between align-items-center mb-2'
                >
                  <UserSmallCard user={user} />
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm rounded-1 ripple'
                    onClick={() => handleRemoveBtn(user)}
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                </div>
              ))}
            </div>
            <button
              type='button'
              className='btn btn-primary ripple w-100 mt-2 rounded-1'
              onClick={handleSubmit}
            >
              {t('button.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreAddStaffForm

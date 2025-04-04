/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import {
  listStoresForAdmin,
  activeStore as activeOrInactive
} from '../../apis/store.api'
import { readableDate } from '../../helper/readable'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import StoreSmallCard from '../card/StoreSmallCard'
import StarRating from '../label/StarRating'
import StoreCommissionLabel from '../label/StoreCommissionLabel'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import { toast } from 'react-toastify'
import StoreActiveLabel from '../label/StoreActiveLabel'
import Error from '../ui/Feedback'
import {
  sendActiveStoreEmail,
  sendBanStoreEmail
} from '../../apis/notification.api'
import boxImg from '../../assets/box.svg'

const AdminStoresTable = ({ heading = false, isActive = true }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [run, setRun] = useState('')
  const [error, setError] = useState('')
  const [stores, setStores] = useState([])
  const [pagination, setPagination] = useState({
    size: 0
  })
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'name',
    sortMoreBy: 'point',
    isActive,
    order: 'asc',
    limit: 5,
    page: 1
  })

  const [activeStore, setActiveStore] = useState({})

  const { _id, accessToken } = getToken()

  const init = () => {
    setIsLoading(true)
    listStoresForAdmin(_id, accessToken, filter)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setStores(data.stores)
          setPagination({
            size: data.size,
            pageCurrent: data.filter.pageCurrent,
            pageCount: data.filter.pageCount
          })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    init()
  }, [filter, run])

  useEffect(() => {
    setFilter({
      ...filter,
      isActive
    })
  }, [isActive])

  const handleChangeKeyword = (keyword) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleChangePage = (newPage) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleSetSortBy = (order, sortBy) => {
    setFilter({
      ...filter,
      sortBy,
      order
    })
  }

  const handleActiveStore = (store) => {
    setActiveStore(store)
    setIsConfirming(true)
  }
  const onSubmit = () => {
    setIsLoading(true)
    const value = { isActive: !activeStore.isActive }
    const active = activeStore.isActive
      ? t('toastSuccess.store.ban')
      : t('toastSuccess.store.active')

    activeOrInactive(_id, accessToken, value, activeStore._id)
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          toast.success(active)
          setRun(!run)

          if (!activeStore.isActive) {
            sendActiveStoreEmail(activeStore.ownerId?._id, activeStore._id)
          } else {
            sendBanStoreEmail(activeStore.ownerId?._id, activeStore._id)
          }
        }
        setTimeout(() => {
          setError('')
        }, 3000)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {heading && (
        <h5 className='text-start'>
          {isActive ? t('title.listActiveStores') : t('title.listBannedStores')}
        </h5>
      )}

      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={
            !activeStore.isActive
              ? t('dialog.activeStore')
              : t('dialog.banStore')
          }
          color={!activeStore.isActive ? 'primary' : 'danger'}
          onClose={() => setIsConfirming(false)}
          onSubmit={onSubmit}
        />
      )}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='mb-3'>
          <SearchInput onChange={handleChangeKeyword} />
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width={'80px'} />
            <h5>{t('storeDetail.noStores')}</h5>
          </div>
        ) : (
          <>
            <div className='table-scroll my-2'>
              <table className='table align-middle table-hover table-sm text-start'>
                <thead>
                  <tr>
                    <th scope='col' className='text-center'></th>
                    <th scope='col' className='text-center'>
                      {t('storeDetail.avatar')}
                    </th>
                    <th scope='col'>{t('storeDetail.storeName')}</th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('storeDetail.rating')}
                        sortBy='rating'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <span style={{ fontWeight: '400', fontSize: '.875rem' }}>
                        {t('storeDetail.contactPerson')}
                      </span>
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('storeDetail.commissions')}
                        sortBy='commissionId'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('status.status')}
                        sortBy='isActive'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('joined')}
                        sortBy='createdAt'
                        onSet={(order, sortBy) =>
                          handleSetSortBy(order, sortBy)
                        }
                      />
                    </th>

                    <th scope='col'>
                      <span>{t('action')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, index) => (
                    <tr key={index}>
                      <th scope='row'>
                        <span className='text-center align-items-center'>
                          {index + 1 + (filter.page - 1) * filter.limit}
                        </span>
                      </th>
                      <td
                        className='hidden-name text-center'
                        style={{ maxWidth: '300px' }}
                      >
                        <StoreSmallCard store={store} />
                      </td>
                      <td className='hidden-avatar'>
                        <StoreSmallCard store={store} />
                      </td>
                      <td>
                        <small>
                          <StarRating stars={store.rating} />
                        </small>
                      </td>
                      <td>
                        <small className='d-grid'>
                          <span>
                            {t('userDetail.name')}:{' '}
                            <span className='text-primary'>
                              {store.ownerId.firstName +
                                ' ' +
                                store.ownerId.lastName || '-'}
                            </span>
                          </span>
                          <span>
                            Email:{' '}
                            <span className='text-primary'>
                              {store.ownerId.email || '-'}
                            </span>
                          </span>
                          <span>
                            {t('userDetail.phone')}:{' '}
                            <span className='text-primary'>
                              {store.ownerId.phone || '-'}
                            </span>
                          </span>
                        </small>
                      </td>
                      <td>
                        <StoreCommissionLabel commission={store.commissionId} />
                      </td>
                      <td>
                        <StoreActiveLabel isActive={store.isActive} />
                      </td>
                      <td>
                        <small>{readableDate(store.createdAt)}</small>
                      </td>
                      <td>
                        <div className='position-relative d-inline-block'>
                          <button
                            type='button'
                            className={`btn btn-sm rounded-1 ripple cus-tooltip ${
                              !store.isActive
                                ? 'btn-outline-success'
                                : 'btn-outline-danger'
                            }`}
                            onClick={() => handleActiveStore(store)}
                          >
                            <span>
                              {store.isActive ? (
                                <i className='fa-solid fa-ban'></i>
                              ) : (
                                <i className='fa-regular fa-circle-check'></i>
                              )}
                            </span>
                          </button>
                          <span className='cus-tooltip-msg'>
                            {!store.isActive
                              ? t('button.active')
                              : t('button.ban')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='d-flex justify-content-between align-items-center px-4'>
              <ShowResult
                limit={filter.limit}
                size={pagination.size}
                pageCurrent={pagination.pageCurrent}
              />
              {pagination.size !== 0 && (
                <Pagination
                  pagination={pagination}
                  onChangePage={handleChangePage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminStoresTable

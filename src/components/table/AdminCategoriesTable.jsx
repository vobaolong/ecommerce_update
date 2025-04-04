/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  listCategories,
  deleteCategory,
  restoreCategory
} from '../../apis/category.api'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import DeletedLabel from '../label/DeletedLabel'
import CategorySmallCard from '../card/CategorySmallCard'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import { toast } from 'react-toastify'
import CategorySelector from '../selector/CategorySelector'
import { readableDate } from '../../helper/readable'
import Modal from '../ui/Modal'
import Error from '../ui/Feedback'

const IMG = import.meta.env.VITE_STATIC_URL

const AdminCategoriesTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)

  const [run, setRun] = useState(false)
  const [deletedCategory, setDeletedCategory] = useState({})
  const [restoredCategory, setRestoredCategory] = useState({})
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    size: 0
  })
  const [filter, setFilter] = useState({
    search: '',
    categoryId: '',
    sortBy: 'categoryId',
    order: 'asc',
    limit: 7,
    page: 1
  })

  const { _id, accessToken } = getToken()

  const init = () => {
    setError('')
    setIsLoading(true)
    listCategories(_id, accessToken, filter)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setCategories(data.categories)
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

  const handleDeleteCategory = (category) => {
    setDeletedCategory(category)
    setIsConfirming(true)
  }

  const handleRestoreCategory = (category) => {
    setRestoredCategory(category)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    setError('')
    setIsLoading(true)
    deleteCategory(_id, accessToken, deletedCategory._id)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.category.delete'))
          setRun(!run)
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  const onSubmitRestore = () => {
    setError('')
    setIsLoading(true)
    restoreCategory(_id, accessToken, restoredCategory._id)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.category.restore'))
          setRun(!run)
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
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
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.delete')}
          message={
            <span>
              {t('message.delete')}
              <CategorySmallCard category={deletedCategory} />
            </span>
          }
          color='danger'
          onSubmit={onSubmitDelete}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {isConfirmingRestore && (
        <ConfirmDialog
          title={t('categoryDetail.restore')}
          message={
            <span>
              {t('message.restore')}
              <CategorySmallCard category={restoredCategory} />
            </span>
          }
          onSubmit={onSubmitRestore}
          onClose={() => setIsConfirmingRestore(false)}
        />
      )}
      <div className='mb-2'>
        {heading && <h5 className='text-start'>{t('admin.categories')}</h5>}
      </div>
      {error && <Error msg={error} />}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className=' d-flex align-items-center justify-content-between mb-3'>
          <SearchInput onChange={handleChangeKeyword} />

          <div className='d-flex gap-1'>
            <div className='align-items-center d-flex justify-content-end'>
              <div className='position-relative d-inline-block'>
                <button
                  type='button'
                  className='btn btn-outline-primary ripple cus-tooltip rounded-1'
                  data-bs-toggle='modal'
                  data-bs-target='#admin-category-tree'
                >
                  <i className='fa-light fa-list-tree'></i>
                  <span className='res-hide ms-2'>
                    {t('categoryDetail.tree')}
                  </span>
                </button>

                <small className='cus-tooltip-msg'>
                  {t('categoryDetail.tree')}
                </small>
              </div>
            </div>
            <Modal
              id='admin-category-tree'
              hasCloseBtn={false}
              title={t('categoryDetail.tree')}
              style={{ maxWidth: '1000px', width: '100%', margin: 'auto' }}
            >
              <CategorySelector isActive={true} isSelected={false} />
            </Modal>
            <Link
              type='button'
              className='btn btn-primary ripple text-nowrap rounded-1'
              to='/admin/category/create'
            >
              <i className='fa-light fa-plus'></i>
              <span className='ms-2 res-hide'>{t('categoryDetail.add')}</span>
            </Link>
          </div>
        </div>

        <div className='table-scroll my-2'>
          <table className='table table-hover table-sm align-middle text-start'>
            <thead>
              <tr>
                <th scope='col' className='text-center'></th>
                <th scope='col' className=''>
                  <SortByButton
                    currentOrder={filter.order}
                    currentSortBy={filter.sortBy}
                    title={t('categoryDetail.name')}
                    sortBy='name'
                    onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                  />
                </th>
                <th scope='col'>
                  <span
                    style={{ fontWeight: '400', fontSize: '.875rem' }}
                    className='text-secondary'
                  >
                    {t('categoryDetail.img')}
                  </span>
                </th>
                <th scope='col'>
                  <SortByButton
                    currentOrder={filter.order}
                    currentSortBy={filter.sortBy}
                    title={t('categoryDetail.parent')}
                    sortBy='categoryId'
                    onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                  />
                </th>

                <th scope='col'>
                  <SortByButton
                    currentOrder={filter.order}
                    currentSortBy={filter.sortBy}
                    title={t('status.status')}
                    sortBy='isDeleted'
                    onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                  />
                </th>
                <th scope='col'>
                  <SortByButton
                    currentOrder={filter.order}
                    currentSortBy={filter.sortBy}
                    title={t('createdAt')}
                    sortBy='createdAt'
                    onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                  />
                </th>
                <th scope='col'>
                  <span
                    style={{ fontWeight: '400', fontSize: '.875rem' }}
                    className='text-secondary'
                  >
                    {t('action')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <th scope='row' className='text-center'>
                    {index + 1 + (filter.page - 1) * filter.limit}
                  </th>
                  <td>{category.name}</td>
                  <td>
                    {category.image ? (
                      <div
                        style={{
                          position: 'relative',
                          width: '50px',
                          height: '50px'
                        }}
                      >
                        <img
                          loading='lazy'
                          src={IMG + category.image}
                          alt={category.name}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: '0',
                            left: '0',
                            objectFit: 'contain',
                            borderRadius: '0.25rem',
                            boxShadow:
                              'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
                          }}
                        />
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {category.categoryId ? (
                      <span
                        className='hidden-avatar badge bg-value text-dark-emphasis border rounded-1 fw-normal'
                        style={{ fontSize: '0.875rem' }}
                      >
                        <CategorySmallCard category={category.categoryId} />
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {category.isDeleted ? <DeletedLabel /> : <ActiveLabel />}
                  </td>
                  <td>{readableDate(category.createdAt)}</td>
                  <td>
                    <div className='position-relative d-inline-block'>
                      <Link
                        type='button'
                        className='btn btn-sm btn-outline-primary ripple me-2 rounded-1 cus-tooltip'
                        to={`/admin/category/edit/${category._id}`}
                        title={t('button.edit')}
                      >
                        <i className='fa-duotone fa-pen-to-square'></i>
                      </Link>
                      <span className='cus-tooltip-msg'>
                        {t('button.edit')}
                      </span>
                    </div>

                    <div className='position-relative d-inline-block'>
                      {!category.isDeleted ? (
                        <button
                          type='button'
                          className='btn btn-sm btn-outline-danger rounded-1 ripple cus-tooltip'
                          onClick={() => handleDeleteCategory(category)}
                          title={t('button.delete')}
                        >
                          <i className='fa-solid fa-trash-alt'></i>
                        </button>
                      ) : (
                        <button
                          type='button'
                          className='btn btn-sm btn-outline-success ripple cus-tooltip'
                          onClick={() => handleRestoreCategory(category)}
                          title={t('button.restore')}
                        >
                          <i className='fa-solid fa-trash-can-arrow-up'></i>
                        </button>
                      )}
                      <span className='cus-tooltip-msg'>
                        {!category.isDeleted
                          ? t('button.delete')
                          : t('button.restore')}
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
      </div>
    </div>
  )
}

export default AdminCategoriesTable

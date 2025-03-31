/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { listProductsForManager } from '../../apis/product.api'
import { formatPrice } from '../../helper/formatPrice'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import CategorySmallCard from '../card/CategorySmallCard'
import ProductActiveLabel from '../label/ProductActiveLabel'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import ProductSmallCard from '../card/ProductSmallCard'
import ShowResult from '../ui/ShowResult'
import Error from '../ui/Feedback'
import Alert from '../ui/Alert'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import boxImg from '../../assets/box.svg'
import { readableDate } from '../../helper/readable'

const StoreProductsTable = ({ storeId = '', selectedOption = 'all' }) => {
  const { t } = useTranslation()
  const [run, setRun] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [sellingProduct, setSellingProduct] = useState({})
  const [pagination, setPagination] = useState({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
  const [alerts, setAlerts] = useState({
    isAllAlert: true,
    isSellingAlert: true,
    isHiddenAlert: true,
    isOutOfStockAlert: true,
    isInfringingAlert: true
  })
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'sold',
    order: 'desc',
    limit: 8,
    quantity: -1,
    page: 1
  })
  const { _id, accessToken } = getToken()

  const fetchProducts = useCallback(async () => {
    setError('')
    setIsLoading(true)
    const filterCopy = { ...filter }

    switch (selectedOption) {
      case 'selling':
        filterCopy.isSelling = true
        break
      case 'hidden':
        filterCopy.isSelling = false
        break
      case 'outOfStock':
        filterCopy.quantity = 0
        break
      case 'infringing':
        filterCopy.isActive = false
        break
      default:
        break
    }

    try {
      const data = await listProductsForManager(
        _id,
        accessToken,
        filterCopy,
        storeId
      )
      if (data.error) throw new Error(data.error)
      setProducts(data.products)
      setPagination({
        size: data.size,
        pageCurrent: data.filter.pageCurrent,
        pageCount: data.filter.pageCount
      })
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, storeId, filter, selectedOption])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, run])

  const handleChangeKeyword = useCallback((keyword) => {
    setFilter((prev) => ({ ...prev, search: keyword, page: 1 }))
  }, [])

  const handleChangePage = useCallback((newPage) => {
    setFilter((prev) => ({ ...prev, page: newPage }))
  }, [])

  const handleSetSortBy = useCallback((order, sortBy) => {
    setFilter((prev) => ({ ...prev, sortBy, order }))
  }, [])

  const handleSellingProduct = useCallback((product) => {
    setSellingProduct(product)
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(async () => {
    if (!isConfirming) return
    setError('')
    setIsLoading(true)
    const value = { isSelling: !sellingProduct.isSelling }
    const action = sellingProduct.isSelling ? 'hide' : 'show'

    try {
      const data = await sellingProduct(
        _id,
        accessToken,
        value,
        storeId,
        sellingProduct._id
      )
      if (data.error) throw new Error(data.error)
      toast.success(t(`toastSuccess.product.${action}`))
      setRun((prev) => !prev)
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, storeId, sellingProduct, t])

  const alertConfig = {
    all: {
      key: 'isSellingAlert',
      msg1: 'Tất cả',
      alert: 'Mục này chứa ',
      msg2: 'tất cả sản phẩm'
    },
    selling: {
      key: 'isAllAlert',
      msg1: 'Đang bán',
      alert: ' Mục này chứa các',
      msg2: 'sản phẩm có thể bán.'
    },
    hidden: {
      key: 'isHiddenAlert',
      msg1: 'Đã ẩn',
      alert: 'Mục này chứa các sản phẩm mà Nhà bán đã tắt toàn bộ lựa chọn',
      msg2: 'Khách hàng không thể xem và đặt hàng.'
    },
    outOfStock: {
      key: 'isOutOfStockAlert',
      msg1: 'Hết hàng',
      alert: 'Mục này chứa các sản phẩm đã hết hàng',
      msg2: 'Khách hàng không thể xem và đặt hàng.'
    },
    infringing: {
      key: 'isInfringingAlert',
      msg1: 'Vi phạm',
      alert: 'Mục này chứa các sản phẩm bị tạm khoá',
      msg2: 'Khách hàng không thể xem và đặt hàng.'
    }
  }

  return (
    <div className='position-relative'>
      {alerts[alertConfig[selectedOption]?.key] && (
        <Alert
          icon={<i className='text-primary fa-solid fa-circle-info'></i>}
          msg1={alertConfig[selectedOption].msg1}
          alert={alertConfig[selectedOption].alert}
          msg2={alertConfig[selectedOption].msg2}
          onClose={() =>
            setAlerts((prev) => ({
              ...prev,
              [alertConfig[selectedOption].key]: false
            }))
          }
        />
      )}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {isConfirming && (
        <ConfirmDialog
          title={
            sellingProduct.isSelling
              ? t('title.hideProduct')
              : t('title.showProduct')
          }
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='mb-3 d-flex justify-content-between'>
          <SearchInput onChange={handleChangeKeyword} />
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width='80px' />
            <h5>{t('productDetail.noProduct')}</h5>
          </div>
        ) : (
          <>
            <div className='table-scroll my-2'>
              <table className='table align-middle table-hover table-sm text-start'>
                <thead>
                  <tr>
                    <th scope='col' className='text-center'></th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.name')}
                        sortBy='name'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.category')}
                        sortBy='categoryId'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.brand')}
                        sortBy='brandId'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col' className='text-end'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.price')}
                        sortBy='price'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col' className='text-end'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.salePrice')}
                        sortBy='salePrice'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.stock')}
                        sortBy='quantity'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.sold')}
                        sortBy='sold'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.values')}
                        sortBy='variantValueIds'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('filters.rating')}
                        sortBy='rating'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('status.status')}
                        sortBy='isActive'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>
                      <SortByButton
                        currentOrder={filter.order}
                        currentSortBy={filter.sortBy}
                        title={t('productDetail.date')}
                        sortBy='createdAt'
                        onSet={handleSetSortBy}
                      />
                    </th>
                    <th scope='col'>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <th scope='row'>
                        {index + 1 + (filter.page - 1) * filter.limit}
                      </th>
                      <td
                        style={{
                          whiteSpace: 'normal',
                          minWidth: '400px',
                          width: 'fit-content'
                        }}
                      >
                        <small>
                          <ProductSmallCard product={product} />
                        </small>
                      </td>
                      <td>
                        <small className='badge border rounded-1 bg-value text-dark-emphasis'>
                          <CategorySmallCard
                            parent={false}
                            category={product.categoryId}
                          />
                        </small>
                      </td>
                      <td>{product.brandId?.name || '-'}</td>
                      <td className='text-end'>
                        {formatPrice(product.price?.$numberDecimal)}
                        <sup>₫</sup>
                      </td>
                      <td className='text-end'>
                        {formatPrice(product.salePrice?.$numberDecimal)}
                        <sup>₫</sup>
                      </td>
                      <td>{product.quantity}</td>
                      <td>{product.sold}</td>
                      <td style={{ whiteSpace: 'normal' }}>
                        <div
                          className='d-flex flex-wrap justify-content-start align-items-center gap-1'
                          style={{
                            width: '250px',
                            maxHeight: '120px',
                            overflow: 'auto'
                          }}
                        >
                          {product.variantValueIds?.length ? (
                            product.variantValueIds.map((value) => (
                              <small
                                key={value._id}
                                className='badge rounded-1 text-dark-emphasis bg-value me-1'
                              >
                                {value.name}
                              </small>
                            ))
                          ) : (
                            <small>-</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <small>
                          <i className='fa-solid fa-star text-warning me-1'></i>
                          {product.rating}
                        </small>
                      </td>
                      <td>
                        <ProductActiveLabel isActive={product.isActive} />
                      </td>
                      <td>
                        <small>{readableDate(product.createdAt)}</small>
                      </td>
                      <td>
                        <div className='d-flex justify-content-start align-items-center gap-2'>
                          <Link
                            className='btn btn-sm btn-outline-primary ripple rounded-1 cus-tooltip'
                            to={`/seller/products/edit/${product._id}/${storeId}`}
                          >
                            <i className='fa-duotone fa-pen-to-square'></i>
                            <span className='cus-tooltip-msg'>
                              {t('button.edit')}
                            </span>
                          </Link>
                          <button
                            type='button'
                            className={`btn btn-sm rounded-1 ripple cus-tooltip btn-outline-${
                              product.isSelling ? 'secondary' : 'success'
                            }`}
                            onClick={() => handleSellingProduct(product)}
                          >
                            <i
                              className={`fa-solid ${
                                product.isSelling ? 'fa-archive' : 'fa-box'
                              }`}
                            ></i>
                            <span className='cus-tooltip-msg'>
                              {product.isSelling
                                ? t('button.hide')
                                : t('button.show')}
                            </span>
                          </button>
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

export default StoreProductsTable

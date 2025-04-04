/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../../apis/product.api'
import {
  getNumberOfFollowersForProduct,
  checkFollowingProduct
} from '../../apis/follow.api'
import Error from '../../components/ui/Feedback'
import { useTranslation } from 'react-i18next'
import Carousel from '../../components/image/Carousel'
import { formatPrice } from '../../helper/formatPrice'
import StarRating from '../../components/label/StarRating'
import MainLayout from '../../components/layout/MainLayout'
import ListReviews from '../../components/list/ListReviews'
import SigninButton from '../../components/item/SigninItem'
import StoreSmallCard from '../../components/card/StoreSmallCard'
import AddToCartForm from '../../components/item/form/AddToCartForm'
import SalePercentLabel from '../../components/label/SalePercentLabel'
import ListProductsByStore from '../../components/list/ListProductsByStore'
import FollowProductButton from '../../components/button/FollowProductButton'
import ListBestSellerProduct from '../../components/list/ListBestSellerProduct'
import { calcPercent } from '../../helper/calcPercent'
import StoreCardSmall from '../../components/card/StoreCardSmall'
import MetaData from '../../components/layout/meta/MetaData'
import refundImg from '../../assets/refund.svg'
import returnImg from '../../assets/return.svg'
import checkImg from '../../assets/package.svg'
import { formatDate, formatOnlyDate } from '../../helper/readable'
import Skeleton from 'react-loading-skeleton'
import Loading from '../../components/ui/Loading'
import notFound from '../../assets/notFound.png'
import Modal from '../../components/ui/Modal'
import ListReport from '../../components/item/form/ListReport'
import { useSelector } from 'react-redux'

const productReasons = [
  {
    value: 'Sản phẩm giả mạo và bản quyền',
    label: 'Sản phẩm giả mạo và bản quyền'
  },
  { value: 'Những sản phẩm bị cấm', label: 'Những sản phẩm bị cấm' },
  { value: 'Đồ đánh cắp', label: 'Đồ đánh cắp' }
]
const DetailPage = () => {
  const { t } = useTranslation()
  const { productId } = useParams()
  const [error, setError] = useState('')
  const [product, setProduct] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const user = useSelector((state) => state.account.user)

  const handleMenuToggle = () => {
    setShowMenu(!showMenu)
  }

  const init = () => {
    setError('')
    setIsLoading(true)
    getProduct(productId)
      .then(async (data) => {
        if (data.error) setError(data.error)
        else if (!data.product?.storeId?.isActive)
          setError(t('toastError.storeBanned'))
        else {
          const newProduct = data.product
          try {
            const res = await getNumberOfFollowersForProduct(newProduct._id)
            newProduct.numberOfFollowers = res.count
          } catch {
            newProduct.numberOfFollowers = 0
          }

          try {
            const { _id, accessToken } = getToken()
            const res = await checkFollowingProduct(
              _id,
              accessToken,
              newProduct._id
            )
            newProduct.isFollowing = res.success ? true : false
          } catch {
            newProduct.isFollowing = false
          }

          setProduct(newProduct)
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
  }, [productId])

  const salePercent = calcPercent(product.price, product.salePrice)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  const descriptionStyle = {
    maxHeight: isExpanded ? 'unset' : '400px',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-in-out'
  }
  const deliveryDateMin = new Date()
  deliveryDateMin.setDate(deliveryDateMin.getDate() + 1)
  const deliveryDateMax = new Date()
  deliveryDateMax.setDate(deliveryDateMax.getDate() + 8)

  return (
    <MainLayout>
      <div className='position-relative'>
        {isLoading && <Loading />}
        {error ? (
          <div className='pt-4 d-flex flex-column align-items-center'>
            <img width={400} src={notFound} alt='product not found' />
            <Error msg={error} />
          </div>
        ) : (
          <div className='pt-3'>
            <MetaData title={`${product.name} | Zenpii Việt Nam`} />
            <nav className='res-hide' aria-label='breadcrumb'>
              <ol className='breadcrumb'>
                <Link to='/' className='breadcrumb-item text-decoration-none'>
                  {t('home')}
                </Link>

                {product.categoryId?.categoryId?.categoryId && (
                  <Link
                    to={`/category/${product.categoryId?.categoryId?.categoryId?._id}`}
                    className='breadcrumb-item text-decoration-none'
                  >
                    {product.categoryId?.categoryId?.categoryId?.name}
                  </Link>
                )}

                {product.categoryId?.categoryId && (
                  <Link
                    to={`/category/${product.categoryId?.categoryId?._id}`}
                    className='breadcrumb-item text-decoration-none'
                  >
                    {product.categoryId?.categoryId?.name}
                  </Link>
                )}

                {product.categoryId && (
                  <Link
                    to={`/category/${product.categoryId?._id}`}
                    className='breadcrumb-item text-decoration-none'
                  >
                    {product.categoryId.name}
                  </Link>
                )}
                {product.name && (
                  <span className='breadcrumb-item nolink default'>
                    {product.name}
                  </span>
                )}
              </ol>
            </nav>
            <div className='container-md'>
              <div
                className='row bg-white rounded-1 box-shadow'
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                <div className='col-lg-5 col-md-6 '>
                  {isLoading ? (
                    <Skeleton height={400} />
                  ) : (
                    <Carousel
                      listImages={product.listImages}
                      alt={product.name}
                      style={{
                        paddingBottom: 'calc(2/3*100%)'
                      }}
                    />
                  )}
                </div>
                <div className='col-lg-7 col-md-6 ps-4'>
                  <div className='d-flex justify-content-between'>
                    <StoreSmallCard
                      isLoading={isLoading}
                      store={product.storeId}
                    />
                    {getToken() && getToken().role === 'user' && (
                      <div className='menu-container'>
                        <button
                          className='btn menu-button'
                          onClick={handleMenuToggle}
                        >
                          <i className='fa fa-ellipsis-v'></i>
                        </button>
                        {showMenu && (
                          <div className='menu d-inline-block '>
                            <button
                              type='button'
                              data-bs-target='#report'
                              data-bs-toggle='modal'
                              className='btn--with-img menu-item text-dark-emphasis'
                            >
                              <i className='fa-solid fa-circle-info me-2'></i>
                              {t('report')}
                            </button>
                            <Modal
                              hasCloseBtn={false}
                              title={t('dialog.report')}
                              id='report'
                            >
                              <ListReport
                                reasons={productReasons}
                                objectId={product._id}
                                reportBy={user._id}
                                isProduct={true}
                                isStore={false}
                                isReview={false}
                                showOtherReason={true}
                              />
                            </Modal>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <h5 className='product-name text-dark-emphasis fs-12 mt-2'>
                    {isLoading ? <Skeleton height={30} /> : product.name}
                  </h5>
                  <div className='d-flex'>
                    <span className='me-2 text-primary text-decoration-none'>
                      {isLoading ? <Skeleton width={50} /> : product.rating}
                    </span>
                    <StarRating stars={isLoading ? 0 : product.rating} />
                    <span className='mx-2 px-2 border-start'>
                      {isLoading ? (
                        <Skeleton width={50} />
                      ) : (
                        <>
                          {product.sold}
                          <span className='text-muted ms-1'>
                            {t('productDetail.sold')}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  {product.brandId.name && (
                    <span className='mt-2'>
                      Thương hiệu: {product.brandId.name}
                    </span>
                  )}
                  <div className='price-div d-flex flex-wrap justify-content-start align-items-center mt-3 bg-light px-3 py-2 rounded-1'>
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      <>
                        {product.salePrice?.$numberDecimal !==
                          product.price?.$numberDecimal && (
                          <del className='text-muted mt-1'>
                            {formatPrice(product.price?.$numberDecimal)}
                            <sup>₫</sup>
                          </del>
                        )}
                        <h4 className='text-primary m-0 ms-3 fw-bold'>
                          {formatPrice(product.salePrice?.$numberDecimal)}
                          <sup>₫</sup>
                        </h4>

                        {salePercent > 5 && (
                          <SalePercentLabel salePercent={salePercent} />
                        )}
                      </>
                    )}
                  </div>

                  <div className='mt-xl-3 mt-lg-2 mt-md-1'>
                    {isLoading ? (
                      <>
                        <Skeleton width={200} height={30} />
                        <Skeleton width={200} height={30} />
                      </>
                    ) : (
                      <>
                        {!product.storeId?.isOpen && (
                          <Error msg={t('storeDetail.messageClose')} />
                        )}
                        <br />
                        {product.quantity <= 0 ? (
                          <Error msg={t('productDetail.soldOut')} />
                        ) : (
                          <small className='text-secondary'>
                            {product.quantity} sản phẩm có sẵn
                          </small>
                        )}
                        {!getToken() && (
                          <SigninButton title={t('button.signInToShopping')} />
                        )}
                        {product.storeId?.isOpen &&
                          product.quantity > 0 &&
                          getToken() &&
                          getToken().role === 'user' && (
                            <AddToCartForm product={product} />
                          )}
                      </>
                    )}
                    {isLoading ? (
                      <Skeleton height={30} count={3} />
                    ) : (
                      <div className='text-dark-emphasis d-grid mt-3 gap-2'>
                        <b className='fs-9s'>{t('productDetail.offers')} (3)</b>
                        <div className=' d-grid gap-1'>
                          <span className='d-flex align-items-center'>
                            <img
                              src={refundImg}
                              className='me-2'
                              style={{ width: '25px' }}
                              alt='refundImg'
                            />
                            <span className='fs-9'>{t('services.refund')}</span>
                          </span>
                          <hr className='my-0 opacity-100' />
                          <span className='d-flex align-items-center'>
                            <img
                              src={returnImg}
                              className='me-2'
                              style={{ width: '25px' }}
                              alt='returnImg'
                            />
                            <span className='fs-9'>{t('services.return')}</span>
                          </span>
                          <hr className='my-0 opacity-100' />
                          <span className='d-flex align-items-center'>
                            <img
                              src={checkImg}
                              className='me-2'
                              style={{ width: '25px' }}
                              alt='checkImg'
                            />
                            <span className='fs-9'>
                              {t('services.checkPackage')}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                    {isLoading ? (
                      <Skeleton className='mt-2' width={150} height={70} />
                    ) : (
                      <div
                        style={{ width: 'max-content' }}
                        className='my-3 text-secondary border rounded p-3'
                      >
                        <span className='d-flex align-items-center gap-2'>
                          <i className='fa-solid fa-truck me-2'></i>
                          <span className='d-grid gap-1 fs-9'>
                            <span className='text-dark-emphasis fw-bold'>
                              {t('productDetail.estimatedDelivery')}
                            </span>
                            <span>
                              {formatOnlyDate(deliveryDateMin)}
                              {' - '}
                              {formatDate(deliveryDateMax)}
                            </span>
                          </span>
                        </span>
                      </div>
                    )}
                    <hr />
                    <div className='d-flex align-items-center gap-2'>
                      {getToken() && getToken().role === 'user' && (
                        <>
                          <div className='me-2 px-3 border-end'>
                            {/* <FacebookShareButton
                              url={
                                window.location.href
                                  ? 'https://hasaki.vn/san-pham/gel-rua-mat-la-roche-posay-cho-da-dau-nhay-cam-400ml-68810.html?gad_source=1&gclid=CjwKCAjw17qvBhBrEiwA1rU9wwx0pGlaJp9LXom7lUNIZFUsUSDTAe2iT_w7EfZcGZdnsMMcaIJROxoCL-oQAvD_BwE'
                                  : ''
                              }
                              quote={product.name}
                            >
                              <i className='fa-brands fa-facebook-f text-secondary'></i>
                            </FacebookShareButton> */}
                          </div>

                          <FollowProductButton
                            productId={product._id}
                            isFollowing={product.isFollowing}
                            onRun={() =>
                              setProduct({
                                ...product,
                                numberOfFollowers: product.isFollowing
                                  ? product.numberOfFollowers - 1
                                  : product.numberOfFollowers + 1,
                                isFollowing: !product.isFollowing
                              })
                            }
                            className='btn-lg'
                          />
                        </>
                      )}

                      {product?.numberOfFollowers > 0 && (
                        <span className='ms-2'>
                          {product?.numberOfFollowers} đã thích
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col-lg-9 col-md-12 rounded-1 box-shadow bg-white'>
                  <div className='row res-flex-reverse-md'>
                    <div className='container'>
                      <ul className='nav nav-tabs' id='myTab' role='tablist'>
                        <li
                          className='nav-item col-6 text-center'
                          role='presentation'
                        >
                          <a
                            className='nav-link active'
                            id='details-tab'
                            data-bs-toggle='tab'
                            href='#details'
                            role='tab'
                            aria-controls='details'
                            aria-selected='true'
                          >
                            {t('productDetail.description')}
                          </a>
                        </li>
                        <li
                          className='nav-item col-6 text-center'
                          role='presentation'
                        >
                          <a
                            className='nav-link'
                            id='reviews-tab'
                            data-bs-toggle='tab'
                            href='#reviews'
                            role='tab'
                            aria-controls='reviews'
                            aria-selected='false'
                          >
                            {t('productDetail.productReview')}
                          </a>
                        </li>
                      </ul>
                      <div className='tab-content p-3' id='myTabContent'>
                        <div
                          className='tab-pane fade show active'
                          id='details'
                          role='tabpanel'
                          aria-labelledby='details-tab'
                        >
                          <div
                            style={{
                              ...descriptionStyle,
                              position: 'relative',
                              paddingBottom: '2rem',
                              marginTop: '1rem'
                            }}
                          >
                            {isLoading ? (
                              <Skeleton height={400} />
                            ) : (
                              <span
                                style={{ whiteSpace: 'pre-line' }}
                                className='fs-9 text-justify'
                              >
                                {product.description}
                              </span>
                            )}
                            <div
                              className={`position-absolute w-100 text-center align-content-end ${
                                !isExpanded ? 'gradient' : ''
                              } pb-2`}
                              style={{
                                bottom: 0,
                                height: '130px'
                              }}
                            >
                              {!isExpanded ? (
                                <span
                                  className='pointer text-primary text-center text-decoration-none'
                                  onClick={handleToggle}
                                >
                                  {t('showMore')}
                                </span>
                              ) : (
                                <span
                                  className='pointer text-primary text-decoration-none'
                                  onClick={handleToggle}
                                >
                                  {t('showLess')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className='tab-pane fade'
                          id='reviews'
                          role='tabpanel'
                          aria-labelledby='reviews-tab'
                        >
                          <div id='reviews'>
                            <ListReviews productId={product._id} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='res-hide col-lg-3 pe-0 d-lg-block d-md-none'>
                  <div className='box-shadow w-100 mb-2'>
                    <StoreCardSmall
                      store={product.storeId}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                {product.categoryId && (
                  <ListBestSellerProduct
                    heading={t('similarProducts')}
                    categoryId={product.categoryId._id}
                  />
                )}
              </div>
              <div className='row mt-3'>
                {product.storeId && (
                  <ListProductsByStore
                    heading={t('sameShop')}
                    storeId={product.storeId._id}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default DetailPage

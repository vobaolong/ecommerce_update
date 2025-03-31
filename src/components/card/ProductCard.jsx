import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { formatPrice } from '../../helper/formatPrice'
import {
  getNumberOfFollowersForProduct,
  checkFollowingProduct
} from '../../apis/follow.api'
import StarRating from '../label/StarRating'
import FollowProductButton from '../button/FollowProductButton'
import { useTranslation } from 'react-i18next'
import { calcPercent } from '../../helper/calcPercent'
import MallLabel from '../label/MallLabel'
import defaultImage from '../../assets/default.webp'
import Skeleton from 'react-loading-skeleton'

const IMG = import.meta.env.VITE_STATIC_URL

const ProductCard = ({ product = {}, onRun }) => {
  const [productValue, setProductValue] = useState({})
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  const fetchProductData = useCallback(async () => {
    setIsLoading(true)
    const newProduct = { ...product }
    try {
      const [followersRes, followCheckRes] = await Promise.all([
        getNumberOfFollowersForProduct(product._id),
        getToken()._id &&
          checkFollowingProduct(
            getToken()._id,
            getToken().accessToken,
            product._id
          )
      ])
      newProduct.numberOfFollowers = followersRes.count ?? 0
      newProduct.isFollowing = followCheckRes?.success ?? false
    } catch {
      newProduct.numberOfFollowers = 0
      newProduct.isFollowing = false
    }
    setProductValue(newProduct)
    setIsLoading(false)
  }, [product])

  useEffect(() => {
    fetchProductData()
  }, [fetchProductData])

  const handleRun = useCallback(
    async (newProduct) => {
      if (onRun) onRun(newProduct)
      const numberOfFollowers = await getNumberOfFollowersForProduct(
        newProduct._id
      )
        .then((data) => data.count)
        .catch(() =>
          newProduct.isFollowing
            ? productValue.numberOfFollowers + 1
            : productValue.numberOfFollowers - 1
        )
      setProductValue((prev) => ({ ...prev, numberOfFollowers }))
    },
    [onRun, productValue.numberOfFollowers]
  )

  const salePercent = useMemo(
    () => calcPercent(productValue.price, productValue.salePrice),
    [productValue.price, productValue.salePrice]
  )

  if (isLoading) {
    return (
      <div className='card border-0 m-auto'>
        <Skeleton height={220} />
        <div className='card-body'>
          <Skeleton height={21} width={94} />
          <Skeleton height={20} width={120} />
          <Skeleton height={35} />
          <Skeleton height={24} />
        </div>
      </div>
    )
  }

  return (
    <div className='card border-0 m-auto'>
      <Link
        className='text-reset text-decoration-none product-card'
        to={`/product/${productValue._id}`}
        title={productValue.name}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='card-img-top cus-card-img-top position-relative'
        >
          <img
            src={
              productValue.listImages?.[0]
                ? `${IMG}${productValue.listImages[0]}`
                : defaultImage
            }
            className='cus-card-img'
            alt={productValue.name}
            style={{
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.5s ease'
            }}
          />
          <img
            src={
              productValue.listImages?.[1]
                ? `${IMG}${productValue.listImages[1]}`
                : defaultImage
            }
            className='cus-card-img'
            alt={productValue.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />
        </div>
        {salePercent > 0 && (
          <div className='sale-tag'>
            {-salePercent}% {t('productDetail.sale')}
          </div>
        )}
        {productValue.numberOfFollowers > 2 && (
          <div className='fav-tag'>{t('favorite')}</div>
        )}
      </Link>

      <div className='card-body'>
        <MallLabel className='mb-2' />
        <small className='card-subtitle'>
          {productValue.rating ? (
            <StarRating stars={productValue.rating} />
          ) : (
            <Skeleton width={94} />
          )}
          <small>
            {' '}
            {productValue.sold} {t('productDetail.sold')}
          </small>
        </small>
        <Link
          className='text-reset link-hover d-block mt-1 mb-2'
          to={`/product/${productValue._id}`}
          title={productValue.name}
        >
          <h6 className='card-title product-name'>{productValue.name}</h6>
        </Link>
        <small className='card-subtitle d-flex justify-content-between align-items-center'>
          <h5 className='text-danger me-2 mb-0'>
            {productValue.salePrice &&
              formatPrice(productValue.salePrice.$numberDecimal)}
            <sup>₫</sup>
          </h5>
          {salePercent !== 0 && (
            <del className='text-muted font-weight-normal text-md'>
              {productValue.price &&
                formatPrice(productValue.price.$numberDecimal)}
              <sup>₫</sup>
            </del>
          )}
        </small>
        <div className='d-flex justify-content-end'>
          {getToken()._id && (
            <FollowProductButton
              productId={productValue._id}
              isFollowing={productValue.isFollowing}
              onRun={handleRun}
              style={{ top: '7px', position: 'absolute' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

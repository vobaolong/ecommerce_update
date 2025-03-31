/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, memo } from 'react'
import { listSellingProductsByStore } from '../../apis/product.api'
import Loading from '../ui/Loading'
import ProductCard from '../card/ProductCard'
import Error from '../ui/Feedback'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

const ListProductsByStore = ({
  heading = '',
  storeId = '',
  sortBy = 'sold'
}) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])

  const init = useCallback(() => {
    setError('')
    setIsLoading(true)
    listSellingProductsByStore(
      {
        search: '',
        rating: '',
        categoryId: '',
        minPrice: '',
        maxPrice: '',
        sortBy,
        order: 'desc',
        limit: 10,
        page: 1
      },
      storeId
    )
      .then((data) => {
        if (data.error) setError(data.error)
        else setProducts(data.products)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }, [storeId, sortBy])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className='position-relative bg-body box-shadow rounded-2 p-3'>
      {heading && <h5 style={{ color: 'var(--muted-color)' }}>{heading}</h5>}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}

      <div className='slider-container'>
        <Swiper
          modules={[FreeMode, Navigation]}
          navigation
          freeMode
          grabCursor
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            820: {
              slidesPerView: 3
            },
            1024: {
              slidesPerView: 4
            },
            1280: {
              slidesPerView: 5
            }
          }}
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index}>
              <div className='my-2'>
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default memo(ListProductsByStore)

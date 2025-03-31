/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, memo, useRef } from 'react'
import { listActiveProducts } from '../../apis/product.api'
import Loading from '../ui/Loading'
import ProductCard from '../card/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Error from '../ui/Feedback'

const ProductCardMemo = memo(ProductCard)

const ListBestSellerProduct = ({
  sortBy = '',
  heading = '',
  categoryId = ''
}) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const isMounted = useRef(true)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await listActiveProducts({
        search: '',
        rating: '',
        categoryId,
        minPrice: '',
        maxPrice: '',
        sortBy: sortBy,
        order: 'desc',
        limit: 20,
        page: 1
      })
      if (isMounted.current) {
        if (data.error) setError(data.error)
        else setProducts(data.products)
      }
    } catch {
      if (isMounted.current) setError('Server Error')
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchProducts()
    return () => {
      isMounted.current = false
    }
  }, [categoryId])

  return (
    <div className='position-relative bg-body box-shadow rounded-2 p-3'>
      {heading && <h5 className='text-dark-emphasis'>{heading}</h5>}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}

      <div className='slider-container'>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={5}
          slidesPerGroup={4}
          speed={600}
          breakpoints={{
            1024: { slidesPerView: 4, slidesPerGroup: 3 },
            820: { slidesPerView: 3, slidesPerGroup: 2 },
            600: { slidesPerView: 2, slidesPerGroup: 2 },
            480: { slidesPerView: 1, slidesPerGroup: 1 }
          }}
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index}>
              <div className='my-2'>
                <ProductCardMemo product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ListBestSellerProduct

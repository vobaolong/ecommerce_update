import { useState, useEffect, useMemo } from 'react'
import { listActiveCategories } from '../../apis/category.api'
import Loading from '../ui/Loading'
import Error from '../ui/Feedback'
import CategoryCard from '../card/CategoryCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

const ListCategories = ({ heading = '', categoryId = null }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])

  const swiperConfig = useMemo(
    () => ({
      modules: [Navigation, A11y],
      spaceBetween: 20,
      navigation: true,
      breakpoints: {
        320: {
          slidesPerView: Math.min(categories.length, 2),
          slidesPerGroup: 1
        },
        480: {
          slidesPerView: Math.min(categories.length, 4),
          slidesPerGroup: 2
        },
        1024: {
          slidesPerView: Math.min(categories.length, 8),
          slidesPerGroup: 4
        }
      }
    }),
    [categories.length]
  )

  const init = async () => {
    try {
      setIsLoading(true)
      const data = await listActiveCategories({
        search: '',
        categoryId,
        sortBy: 'name',
        order: 'asc',
        limit: 20,
        page: 1
      })

      if (data.error) setError(data.error)
      else setCategories(data.categories)
    } catch {
      setError('Server Error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  if (!categories.length) return null

  return (
    <div className='bg-body box-shadow rounded-3 p-3'>
      {heading && <h5>{heading}</h5>}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      <Swiper {...swiperConfig}>
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ListCategories

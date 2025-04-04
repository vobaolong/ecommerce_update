import { useState, useEffect } from 'react'
import { getListStores } from '../../apis/store.api'
import Loading from '../ui/Loading'
import StoreCard from '../card/StoreCard'
import Slider from 'react-slick'
import Error from '../ui/Feedback'

const ListHotStores = ({ heading = '' }) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stores, setStores] = useState([])
  const settings = {
    className: 'center',
    infinite: false,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 4,
    initialSlide: 0,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }
  const init = () => {
    setError('')
    setIsLoading(true)
    getListStores({
      search: '',
      sortBy: 'rating',
      sortMoreBy: 'point',
      isActive: 'true',
      order: 'desc',
      limit: 10,
      page: 1
    })
      .then((data) => {
        if (data.error) setError(data.error)
        else setStores(data.stores)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className='position-relative bg-body box-shadow rounded-3 p-3'>
      {heading && <h5>{heading}</h5>}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      <div className='slider-container'>
        <Slider {...settings}>
          {stores?.map((store, index) => (
            <div className='my-2' key={index}>
              <StoreCard store={store} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ListHotStores

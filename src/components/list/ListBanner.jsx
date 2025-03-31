import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import banner1 from '../../assets/1.png'
import banner2 from '../../assets/2.jpg'

const ListBanner = () => {
  return (
    <div className='banner-container'>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        speed={500}
      >
        <SwiperSlide>
          <img src={banner1} alt='Banner 1' style={{ width: '100%' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2} alt='Banner 2' style={{ width: '100%' }} />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default ListBanner

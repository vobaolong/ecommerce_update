/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { listActiveCategories } from '../../apis/category.api'
import defaultImage from '../../assets/default.webp'
import Skeleton from 'react-loading-skeleton'

const IMG = import.meta.env.VITE_STATIC_URL

const CategoryCard = ({ category = {} }) => {
  const [categoryValue, setCategoryValue] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setCategoryValue(category)
    setIsLoading(true)
    try {
      await listActiveCategories({
        search: '',
        categoryId: category._id,
        sortBy: 'name',
        order: 'asc',
        limit: 3,
        page: 1
      })
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }, [category._id])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <div className='card-sm py-3'>
      <div className='bg-body-secondary rounded-circle m-auto w-75'>
        <Link
          className='text-reset text-decoration-none'
          to={`/category/${categoryValue._id}`}
          title={categoryValue.name}
        >
          <div className='card-img-top cus-card-img-top'>
            {isLoading ? (
              <Skeleton circle height={100} width={100} />
            ) : (
              <img
                loading='lazy'
                src={
                  categoryValue.image
                    ? `${IMG}${categoryValue.image}`
                    : defaultImage
                }
                className='cus-card-img rounded-circle border'
                alt={categoryValue.name}
              />
            )}
          </div>
        </Link>
      </div>

      <div className='card-body p-0'>
        <Link
          className='text-reset link-hover d-block mt-1 text-center'
          to={`/category/${categoryValue._id}`}
          title={categoryValue.name}
        >
          <span
            className='card-title'
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {isLoading ? <Skeleton width={100} /> : categoryValue.name}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default CategoryCard

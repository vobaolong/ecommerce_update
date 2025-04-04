/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { getProductByIdForManager } from '../../../apis/product.api'
import Loading from '../../ui/Loading'
import SellerEditProductProfileForm from './SellerEditProductProfileForm'
import SellerEditProductImagesForm from './SellerEditProductImagesForm'
import Error from '../../ui/Feedback'

const SellerEditProductForm = ({ storeId = '', productId = '' }) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [run, setRun] = useState(false)
  const [product, setProduct] = useState({})

  useEffect(() => {
    const { _id, accessToken } = getToken()
    setIsLoading(true)
    getProductByIdForManager(_id, accessToken, productId, storeId)
      .then((data) => {
        if (data.error) setError(data.error)
        else setProduct(data.product)
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => setError(''), 3000)
      })
  }, [productId, storeId, run])

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}

      <div className='row bg-body box-shadow rounded-2 p-3 mb-3'>
        <SellerEditProductImagesForm
          product={product}
          storeId={storeId}
          onRun={() => setRun(!run)}
        />
      </div>

      <div className='row mb-3'>
        <SellerEditProductProfileForm product={product} storeId={storeId} />
      </div>
    </div>
  )
}

export default SellerEditProductForm

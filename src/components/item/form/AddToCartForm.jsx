import { useState, useEffect, useMemo } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addToCart } from '../../../apis/cart.api'
import Loading from '../../ui/Loading'
import VariantValueSelector from '../../selector/VariantValueSelector'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Feedback'

const AddToCartForm = ({ product = {} }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const [error, setError] = useState('')
  const [cartItem, setCartItem] = useState({})

  const defaultVariantValues = useMemo(() => {
    const defaultList = product.variantValueIds?.reduce((acc, value) => {
      const existingList = acc.find(
        (list) => list[0].variantId._id === value.variantId._id
      )
      if (existingList) {
        existingList.push(value)
        existingList.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        acc.push([value])
      }
      return acc
    }, [])

    return defaultList?.map((list) => list[0]) || []
  }, [product.variantValueIds])

  useEffect(() => {
    if (!defaultVariantValues.length) return

    setCartItem({
      storeId: product.storeId?._id,
      productId: product._id,
      variantValueIds: defaultVariantValues.map((v) => v._id).join('|'),
      defaultVariantValues,
      count: 1
    })
  }, [product._id, product.storeId, defaultVariantValues])

  const handleSet = (values) => {
    setCartItem({
      ...cartItem,
      variantValueIds: values.map((value) => value._id).join('|')
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }
  const onSubmit = () => {
    const { _id, accessToken } = getToken()
    setError('')
    setIsLoading(true)
    addToCart(_id, accessToken, cartItem)
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          updateDispatch('account', data.user)
          toast.success(t('toastSuccess.cart.add'))
        }
        setTimeout(() => {
          setError('')
        }, 3000)
        setTimeout(() => {
          setCartItem({})
        }, 1000)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setTimeout(() => {
          setError('')
        }, 3000)
        setIsLoading(false)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      <form className='row'>
        <div className='col-12'>
          <VariantValueSelector
            listValues={product.variantValueIds}
            isEditable={true}
            defaultValue={cartItem.defaultVariantValues}
            onSet={(values) => handleSet(values)}
          />
        </div>
        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}
        <div
          className='col-md-12 d-grid mt-2'
          style={{ maxWidth: 'fit-content' }}
        >
          <button
            type='submit'
            className='btn add-to-cart-btn rounded-1 ripple d-flex align-items-center justify-content-center'
            onClick={handleSubmit}
          >
            <i className='fa-solid fa-cart-plus'></i>
            <span className='ms-2 fs-6'>{t('productDetail.addToCart')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddToCartForm

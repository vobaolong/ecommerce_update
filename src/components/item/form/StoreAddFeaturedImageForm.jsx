import { useState, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addFeaturedImage } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import InputFile from '../../ui/InputFile'
import Error from '../../ui/Feedback'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const StoreAddFeaturedImageForm = ({ storeId = '' }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const [featuredImage, setFeaturedImage] = useState({
    image: '',
    isValidImage: true
  })
  const { _id, accessToken } = getToken()

  const handleChange = useCallback((name, isValidName, value) => {
    setFeaturedImage((prev) => ({
      ...prev,
      [name]: value,
      [isValidName]: true
    }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setFeaturedImage((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!featuredImage.image || !featuredImage.isValidImage) {
        setFeaturedImage((prev) => ({
          ...prev,
          isValidImage: !!featuredImage.image
        }))
        return
      }
      setIsConfirming(true)
    },
    [featuredImage]
  )

  const onSubmit = useCallback(async () => {
    const formData = new FormData()
    formData.set('featured_image', featuredImage.image)

    setError('')
    setIsLoading(true)
    try {
      const data = await addFeaturedImage(_id, accessToken, formData, storeId)
      if (data.error) throw new Error(data.error)
      updateDispatch('seller', data.store)
      setFeaturedImage({ image: '', isValidImage: true })
      toast.success(t('toastSuccess.store.addCarousel'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id, accessToken, storeId, updateDispatch, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('storeDetail.addFeaturedImg')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <InputFile
            label=''
            size='featured'
            value={featuredImage.image}
            defaultSrc={featuredImage.image}
            isValid={featuredImage.isValidImage}
            feedback={t('storeDetailValid.featuredValid')}
            accept='image/jpg, image/jpeg, image/png, image/gif, image/webp'
            onChange={(value) => handleChange('image', 'isValidImage', value)}
            onValidate={(flag) => handleValidate('isValidImage', flag)}
          />
        </div>
        {error && (
          <div className='col-12 mt-2'>
            <Error msg={error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StoreAddFeaturedImageForm

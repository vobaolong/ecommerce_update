import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateAvatar } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const StoreAvatarUpload = ({ storeId = '' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { _id, accessToken } = getToken()
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()

  const handleChange = (e) => {
    if (e.target.files[0] == null) return

    const formData = new FormData()
    formData.set('photo', e.target.files[0])
    setError('')
    setIsLoading(true)
    updateAvatar(_id, accessToken, formData, storeId)
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setTimeout(() => {
            setError('')
          }, 3000)
        } else {
          updateDispatch('seller', data.store)
          toast.success(t('toastSuccess.addAvatar'))
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <>
      {isLoading && <Loading />}
      <label className='cus-avatar-icon'>
        <i className='fa-solid fa-camera'></i>
        {error && (
          <span>
            <Error msg={error} />
          </span>
        )}
        <input
          className='visually-hidden'
          type='file'
          accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
          onChange={handleChange}
        />
      </label>
    </>
  )
}

export default StoreAvatarUpload

import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateAvatar } from '../../../apis/user.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const UserAvatarUpload = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const handleChange = (e) => {
    if (e.target.files[0] == null) return
    const { _id, accessToken } = getToken()
    const formData = new FormData()
    formData.set('photo', e.target.files[0])
    setIsLoading(true)
    updateAvatar(_id, accessToken, formData)
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setTimeout(() => {
            setError('')
          }, 3000)
        } else {
          updateDispatch('account', data.user)
          toast.success(t('toastSuccess.addAvatar'))
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
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

export default UserAvatarUpload

import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateProfile } from '../../../apis/store.api'
import { getAddressCache } from '../../../apis/address.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Input from '../../ui/Input'
import TextArea from '../../ui/TextArea'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Error from '../../ui/Feedback'
import AddressForm from './AddressForm'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const StoreEditProfileForm = ({
  name = '',
  bio = '',
  address = '',
  storeId = ''
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({
    name,
    bio,
    address,
    isValidName: true,
    isValidBio: true,
    isValidAddress: true
  })
  const [addressDetail, setAddressDetail] = useState(null)
  const [updateDispatch] = useUpdateDispatch()
  const { _id, accessToken } = getToken()

  const fetchAddress = useCallback(async (addr) => {
    setIsLoading(true)
    try {
      const res = await getAddressCache(encodeURIComponent(addr))
      setAddressDetail(res)
    } catch {
      setError('Failed to fetch address')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddress(address)
    setProfile({
      name,
      bio,
      address,
      isValidName: true,
      isValidBio: true,
      isValidAddress: true
    })
  }, [name, bio, address, storeId, fetchAddress])

  const handleChange = useCallback((name, isValidName, value) => {
    setProfile((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setProfile((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { isValidName, isValidBio, isValidAddress } = profile
      if (!isValidName || !isValidBio || !isValidAddress) return
      setIsConfirming(true)
    },
    [profile]
  )

  const onSubmit = useCallback(async () => {
    const store = {
      name: profile.name,
      bio: profile.bio,
      address: profile.address,
      addressDetail
    }
    setError('')
    setIsLoading(true)
    try {
      const data = await updateProfile(_id, accessToken, store, storeId)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.store.update'))
      updateDispatch('seller', data.store)
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, storeId, profile, addressDetail, updateDispatch, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('storeDetail.editProfile')}
          message={t('message.edit')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('storeDetail.storeName')}
            value={profile.name}
            isValid={profile.isValidName}
            feedback={t('storeDetailValid.validName')}
            validator='name'
            required
            placeholder={t('storeNamePlaceholder')}
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <TextArea
            label={t('storeDetail.bio')}
            value={profile.bio}
            isValid={profile.isValidBio}
            feedback={t('storeDetailValid.bioValid')}
            validator='bio'
            onChange={(value) => handleChange('bio', 'isValidBio', value)}
            onValidate={(flag) => handleValidate('isValidBio', flag)}
            rows={5}
          />
        </div>
        <div className='col-12 mt-3'>
          {addressDetail && (
            <AddressForm
              addressDetail={addressDetail}
              onChange={(value) => {
                setAddressDetail((prev) => ({ ...prev, ...value }))
                handleChange('address', 'isValidAddress', value.street)
              }}
            />
          )}
        </div>
        {error && (
          <div className='col-12 mt-3'>
            <Error msg={error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StoreEditProfileForm

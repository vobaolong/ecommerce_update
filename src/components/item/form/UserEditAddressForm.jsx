import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateAddress } from '../../../apis/user.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const UserEditAddressForm = ({ oldAddress = '', index = null }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    ward: '',
    district: '',
    province: '',
    isValidStreet: true,
    isValidWard: true,
    isValidDistrict: true,
    isValidProvince: true
  })
  const [updateDispatch] = useUpdateDispatch()
  const { _id, accessToken } = getToken()

  const parseAddress = useCallback((addr) => {
    try {
      const [street = '', ward = '', district = '', province = ''] =
        addr.split(', ')
      return { street, ward, district, province }
    } catch {
      return { street: '', ward: '', district: '', province: '' }
    }
  }, [])

  const handleChange = useCallback((name, isValidName, value) => {
    setAddress((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setAddress((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { street, ward, district, province } = address
      const validations = {
        isValidStreet: regexTest('address', street),
        isValidWard: regexTest('address', ward),
        isValidDistrict: regexTest('address', district),
        isValidProvince: regexTest('address', province)
      }

      if (
        !street ||
        !ward ||
        !district ||
        !province ||
        !Object.values(validations).every(Boolean)
      ) {
        setAddress((prev) => ({ ...prev, ...validations }))
        return
      }

      setIsConfirming(true)
    },
    [address]
  )

  const onSubmit = useCallback(async () => {
    const addressString = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`
    setError('')
    setIsLoading(true)
    try {
      const data = await updateAddress(_id, accessToken, index, {
        address: addressString
      })
      if (data.error) throw new Error(data.error)
      updateDispatch('account', data.user)
      toast.success(t('toastSuccess.address.update'))
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, index, address, updateDispatch, t])

  useEffect(() => {
    const { street, ward, district, province } = parseAddress(oldAddress)
    setAddress({
      street,
      ward,
      district,
      province,
      isValidStreet: true,
      isValidWard: true,
      isValidDistrict: true,
      isValidProvince: true
    })
  }, [oldAddress, index, parseAddress])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('userDetail.editAddress')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2 gap-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.street')}
            value={address.street}
            isValid={address.isValidStreet}
            feedback={t('addressFormValid.streetValid')}
            validator='address'
            required
            onChange={(value) => handleChange('street', 'isValidStreet', value)}
            onValidate={(flag) => handleValidate('isValidStreet', flag)}
          />
        </div>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.ward')}
            value={address.ward}
            isValid={address.isValidWard}
            feedback={t('addressFormValid.wardValid')}
            validator='address'
            required
            onChange={(value) => handleChange('ward', 'isValidWard', value)}
            onValidate={(flag) => handleValidate('isValidWard', flag)}
          />
        </div>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.district')}
            value={address.district}
            isValid={address.isValidDistrict}
            feedback={t('addressFormValid.districtValid')}
            validator='address'
            required
            onChange={(value) =>
              handleChange('district', 'isValidDistrict', value)
            }
            onValidate={(flag) => handleValidate('isValidDistrict', flag)}
          />
        </div>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.province')}
            value={address.province}
            isValid={address.isValidProvince}
            feedback={t('addressFormValid.provinceValid')}
            validator='address'
            required
            onChange={(value) =>
              handleChange('province', 'isValidProvince', value)
            }
            onValidate={(flag) => handleValidate('isValidProvince', flag)}
          />
        </div>
        {error && (
          <div className='col-12'>
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

export default UserEditAddressForm

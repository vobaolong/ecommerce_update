import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { getToken } from '../../../apis/auth.api'
import { addAddress } from '../../../apis/user.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Input from '../../ui/Input'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const apiEndpoints = {
  province:
    'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
  district:
    'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
  ward: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward'
}

const apiHeaders = { Token: 'df39b10b-1767-11ef-bfe9-c2d25c6518ab' }

const UserAddAddressForm = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [address, setAddress] = useState({
    province: '',
    provinceName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    isValidStreet: true
  })
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false)
  const [isLoadingWard, setIsLoadingWard] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const { _id, accessToken } = getToken()

  const fetchProvinces = useCallback(async () => {
    try {
      const { data } = await axios.get(apiEndpoints.province, {
        headers: apiHeaders
      })
      setProvinces(data.data || [])
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }, [])

  const fetchDistricts = useCallback(async (provinceId) => {
    setIsLoadingDistrict(true)
    try {
      const { data } = await axios.get(apiEndpoints.district, {
        headers: apiHeaders,
        params: { province_id: provinceId }
      })
      setDistricts(data.data || [])
    } catch (error) {
      console.error('Error fetching districts:', error)
      setDistricts([])
    } finally {
      setIsLoadingDistrict(false)
    }
  }, [])

  const fetchWards = useCallback(async (districtId) => {
    setIsLoadingWard(true)
    try {
      const { data } = await axios.get(apiEndpoints.ward, {
        headers: apiHeaders,
        params: { district_id: districtId }
      })
      setWards(data.data || [])
    } catch (error) {
      console.error('Error fetching wards:', error)
      setWards([])
    } finally {
      setIsLoadingWard(false)
    }
  }, [])

  useEffect(() => {
    fetchProvinces()
  }, [fetchProvinces])

  const handleProvinceChange = useCallback(
    (e) => {
      const value = e.target.value
      const name = e.target.options[e.target.selectedIndex].text.trim()
      setAddress((prev) => ({
        ...prev,
        province: value,
        provinceName: name,
        district: '',
        districtName: '',
        ward: '',
        wardName: ''
      }))
      if (value) fetchDistricts(value)
      else setDistricts([])
      setWards([])
    },
    [fetchDistricts]
  )

  const handleDistrictChange = useCallback(
    (e) => {
      const value = e.target.value
      const name = e.target.options[e.target.selectedIndex].text.trim()
      setAddress((prev) => ({
        ...prev,
        district: value,
        districtName: name,
        ward: '',
        wardName: ''
      }))
      if (value) fetchWards(value)
      else setWards([])
    },
    [fetchWards]
  )

  const handleWardChange = useCallback((e) => {
    const value = e.target.value
    const name = e.target.options[e.target.selectedIndex].text.trim()
    setAddress((prev) => ({ ...prev, ward: value, wardName: name }))
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
      const { provinceName, districtName, wardName, street } = address
      if (!provinceName || !districtName || !wardName || !street) {
        setError(t('addressFormValid.allFields'))
        return
      }
      setIsConfirming(true)
    },
    [address, t]
  )

  const onSubmit = useCallback(async () => {
    const addressString = `${address.street}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`
    const addressData = {
      provinceID: address.province,
      provinceName: address.provinceName,
      districtID: address.district,
      districtName: address.districtName,
      wardID: address.ward,
      wardName: address.wardName,
      address: addressString
    }

    setError('')
    setIsLoading(true)
    try {
      const data = await addAddress(_id, accessToken, addressData)
      if (data.error) throw new Error(data.error)
      updateDispatch('account', data.user)
      setAddress({
        province: '',
        provinceName: '',
        district: '',
        districtName: '',
        ward: '',
        wardName: '',
        street: '',
        isValidStreet: true
      })
      toast.success(t('toastSuccess.address.add'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, address, updateDispatch, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('userDetail.addAddress')}
          message={t('confirmDialog')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2 text-start gap-3' onSubmit={handleSubmit}>
        <div className='col-12 d-flex justify-content-between align-items-center'>
          <label className='col-3 me-3' htmlFor='province'>
            {t('addressForm.province')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1'
            id='province'
            onChange={handleProvinceChange}
            value={address.province}
          >
            <option value=''>{t('addressForm.selectProvince')}</option>
            {provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div className='col-12 d-flex justify-content-between align-items-center position-relative'>
          <label className='col-3 me-3' htmlFor='district'>
            {t('addressForm.district')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1'
            id='district'
            onChange={handleDistrictChange}
            value={address.district}
            disabled={!address.province || isLoadingDistrict}
          >
            <option value=''>{t('addressForm.selectDistrict')}</option>
            {districts.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
          {isLoadingDistrict && <Loading />}
        </div>
        <div className='col-12 d-flex justify-content-between align-items-center position-relative'>
          <label className='col-3 me-3' htmlFor='ward'>
            {t('addressForm.ward')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1'
            id='ward'
            onChange={handleWardChange}
            value={address.ward}
            disabled={!address.district || isLoadingWard}
          >
            <option value=''>{t('addressForm.selectWard')}</option>
            {wards.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
          {isLoadingWard && <Loading />}
        </div>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.street')}
            value={address.street}
            isValid={address.isValidStreet}
            feedback={t('addressFormValid.streetValid')}
            validator='address'
            required
            maxLength='100'
            onChange={(value) => handleChange('street', 'isValidStreet', value)}
            onValidate={(flag) => handleValidate('isValidStreet', flag)}
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

export default UserAddAddressForm

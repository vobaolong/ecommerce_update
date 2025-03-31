import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getToken } from '../../../apis/auth.api'
import { createStore } from '../../../apis/store.api'
import { listActiveCommissions as getListCommissions } from '../../../apis/commission.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import InputFile from '../../ui/InputFile'
import TextArea from '../../ui/TextArea'
import DropDownMenu from '../../ui/DropDownMenu'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AddressForm from './AddressForm'
import { sendCreateStoreEmail } from '../../../apis/notification.api'
import { socketId } from '../../../utils/socket'

const INITIAL_FORM_STATE = {
  name: '',
  bio: '',
  address: '',
  commissionId: '',
  avatar: '',
  cover: ''
}

const INITIAL_VALIDATION_STATE = {
  isValidName: true,
  isValidBio: true,
  isValidAddress: true,
  isValidAvatar: true,
  isValidCover: true
}

const UserCreateStoreForm = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { _id, accessToken } = getToken()
  const user = useSelector((state) => state.account.user)

  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [validation, setValidation] = useState(INITIAL_VALIDATION_STATE)
  const [addressDetail, setAddressDetail] = useState({})
  const [listActiveCommissions, setListActiveCommissions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [error, setError] = useState('')

  const fetchCommissions = useCallback(async () => {
    try {
      const data = await getListCommissions()
      if (data.error) throw new Error(data.error)
      setListActiveCommissions(data.commissions)
      setFormState((prev) => ({
        ...prev,
        commissionId: data.commissions[0]._id
      }))
    } catch (err) {
      setError(err.message || 'Failed to load commissions')
    }
  }, [])

  useEffect(() => {
    fetchCommissions()
  }, [fetchCommissions])

  useEffect(() => {
    const checkScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setIsScrolled(!isBottom)
    }
    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  const commissionOptions = useMemo(
    () =>
      listActiveCommissions?.map((c) => ({
        value: c._id,
        label: `${c.name} (${c.fee.$numberDecimal}%/${t('order')})`
      })),
    [listActiveCommissions, t]
  )

  const validateForm = useCallback(() => {
    const newValidation = {
      isValidName:
        regexTest('name', formState.name) &&
        !formState.name.toLowerCase().includes('zenpii'),
      isValidBio: regexTest('bio', formState.bio),
      isValidAddress: regexTest('address', formState.address),
      isValidAvatar: !!formState.avatar,
      isValidCover: !!formState.cover
    }
    setValidation(newValidation)
    return Object.values(newValidation).every(Boolean)
  }, [formState])

  const handleChange = useCallback((name, validationKey, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (validationKey) {
      setValidation((prev) => ({ ...prev, [validationKey]: true }))
    }
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!validateForm()) return
      setIsConfirming(true)
    },
    [validateForm]
  )

  const onSubmit = useCallback(async () => {
    const formData = new FormData()
    Object.entries(formState).forEach(([key, value]) => {
      formData.set(key, value)
    })
    formData.set('addressDetail', JSON.stringify(addressDetail))

    setIsLoading(true)
    setError('')

    try {
      const data = await createStore(_id, accessToken, formData)
      if (data.error) throw new Error(data.error)

      socketId.emit('notificationShopNew', {
        objectId: '',
        from: user._id,
        to: import.meta.env.ADMIN_ID
      })

      await sendCreateStoreEmail(user._id, data.storeId)
      toast.success(t('toastSuccess.store.create'))
      history.push(`/seller/${data.storeId}`)
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [formState, addressDetail, _id, accessToken, user._id, history, t])

  return (
    <div className='position-relative container-fluid'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.createStore')}
          message={
            <small>
              {t('storeDetail.agreeBy')}{' '}
              <Link to='/legal/privacy' target='_blank'>
                {t('footer.policy')}.
                <br />
              </Link>
              {t('storeDetail.getPaid')}{' '}
              <Link to='/legal/sellOnZenpii' target='_blank'>
                {t('storeDetail.sellOn')}
              </Link>
              .
            </small>
          }
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <form className='' onSubmit={handleSubmit}>
        <div className='box-shadow rounded-1 row mb-2 bg-body p-2'>
          <div className='col-12 py-2'>
            <span className='fw-normal fs-12'>
              {t('storeDetail.basicInfo')}
            </span>
          </div>

          <div className='col-12 px-4 mt-2'>
            {error && <Error msg={error} />}
            {!error && (
              <DropDownMenu
                listItem={commissionOptions}
                value={formState.commissionId}
                setValue={(value) => handleChange('commissionId', null, value)}
                size='lg'
                label={t('storeDetail.typeOfStall')}
                required={true}
                borderBtn={false}
              />
            )}
          </div>

          <div className='col-12 px-4 mt-2'>
            <Input
              type='text'
              label={t('storeDetail.storeName')}
              value={formState.name}
              isValid={validation.isValidName}
              feedback={t('storeDetailValid.validName')}
              validator='name'
              placeholder='Ví dụ: Cửa hàng giày ABC'
              required={true}
              onChange={(value) => handleChange('name', 'isValidName', value)}
            />
          </div>

          <div className='col-12 px-4 mt-2'>
            <TextArea
              type='text'
              label='Bio'
              value={formState.bio}
              isValid={validation.isValidBio}
              feedback={t('storeDetailValid.bioValid')}
              validator='bio'
              placeholder='Ví dụ: Chào mừng bạn đến với Cửa hàng giày ABC!
							Chúng tôi tự hào là địa chỉ tin cậy cho những tín đồ yêu giày, mang đến những mẫu giày thời trang, chất lượng và phong cách. Với sự đa dạng về kiểu dáng và màu sắc, chúng tôi cam kết mang lại sự thoải mái và tự tin cho từng bước chân của bạn. Hãy đến và trải nghiệm sự khác biệt tại Cửa hàng giày ABC – nơi phong cách gặp gỡ chất lượng!
							Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi!'
              required={true}
              onChange={(value) => handleChange('bio', 'isValidBio', value)}
            />
          </div>
          <div className='col-12 px-4 mt-2'>
            <AddressForm
              onChange={(value) => {
                setAddressDetail({ ...value })
                handleChange('address', 'isValidAddress', value.street)
              }}
            />
          </div>
        </div>

        <div className='box-shadow rounded-1 row mb-2 bg-body p-2 mt-3'>
          <div className='col-12 px-3 py-1'>
            <span className='fw-normal fs-12'>{t('storeDetail.imgInfo')}</span>
          </div>
          <div className='col-2 px-4'>
            <InputFile
              label={t('storeDetail.avatar')}
              size='avatar'
              value={formState.avatar}
              isValid={validation.isValidAvatar}
              feedback={t('storeDetailValid.avatarValid')}
              required={true}
              accept='image/jpg, image/jpeg, image/png, image/gif, image/webp'
              onChange={(value) =>
                handleChange('avatar', 'isValidAvatar', value)
              }
            />
          </div>

          <div className='col-10 px-4'>
            <InputFile
              label={t('storeDetail.cover')}
              size='cover'
              value={formState.cover}
              isValid={validation.isValidCover}
              required={true}
              feedback={t('storeDetailValid.coverValid')}
              accept='image/jpg, image/jpeg, image/png, image/gif, image/webp'
              onChange={(value) => handleChange('cover', 'isValidCover', value)}
            />
          </div>
        </div>

        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 row px-4 p-3 mt-3`}
          style={{ position: 'sticky', bottom: '0' }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <Link
              to='/account/store'
              className='text-decoration-none link-hover res-w-100-md my-2'
            >
              <i className='fa-solid fa-angle-left'></i>{' '}
              {t('storeDetail.backToStore')}
            </Link>
            <small className='text-center d-block mx-2'>
              <span className='text-muted'>{t('storeDetail.getPaid')}</span>{' '}
              <Link to='/legal/sellOnZenpii' target='_blank'>
                {t('storeDetail.sellOn')}
              </Link>
              <br className='res-hide' />
              <input
                type='checkbox'
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span className='ms-2 text-muted'>
                {t('storeDetail.agreeBy')}{' '}
              </span>
              <Link to='/legal/privacy' target='_blank'>
                {t('footer.policy')}
              </Link>
            </small>
            <button
              type='submit'
              className='btn btn-primary ripple res-w-100-md rounded-1'
              onClick={handleSubmit}
              disabled={!isChecked}
              style={{ width: '200px', maxWidth: '100%' }}
            >
              {t('button.submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UserCreateStoreForm

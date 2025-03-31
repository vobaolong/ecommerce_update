import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createVariant } from '../../../apis/variant.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Feedback'

const AdminCreateVariantForm = () => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [error, setError] = useState('')
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [newVariant, setNewVariant] = useState({
    name: '',
    categoryIds: [],
    isValidName: true
  })
  const navigate = useNavigate()
  const { _id, accessToken } = getToken()

  useEffect(() => {
    const handleScroll = () =>
      setIsScrolled(
        window.scrollY < document.body.offsetHeight - window.innerHeight
      )
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBack = useCallback(() => setIsConfirmingBack(true), [])
  const confirmBack = useCallback(() => navigate('/admin/variant'), [navigate])

  const handleChange = useCallback((name, isValidName, value) => {
    setNewVariant((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setNewVariant((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { name, categoryIds } = newVariant
      if (!name || !categoryIds.length) {
        setNewVariant((prev) => ({
          ...prev,
          isValidName: regexTest('anything', name)
        }))
        return
      }
      if (!newVariant.isValidName) return
      setIsConfirming(true)
    },
    [newVariant]
  )

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await createVariant(_id, accessToken, newVariant)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.variant.create'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, newVariant, t])

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('variantDetail.add')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t('dialog.cancelCreate')}
          onSubmit={confirmBack}
          onClose={() => setIsConfirmingBack(false)}
          message={t('confirmDialog')}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className='row bg-body rounded-1 box-shadow'>
          <div className='col-12 bg-primary p-3 rounded-top-2'>
            <h1 className='text-white fs-5 m-0'>{t('variantDetail.add')}</h1>
          </div>
          <div className='col-12 mt-3 px-4'>
            <p>{t('productDetail.chooseCategory')}</p>
            <MultiCategorySelector
              label={t('chosenCategory')}
              isActive={false}
              isRequired
              onSet={(categories) =>
                handleChange(
                  'categoryIds',
                  'isValidName',
                  categories ? categories.map((c) => c._id) : []
                )
              }
            />
          </div>
          <div className='col-12 px-4 my-3'>
            <Input
              type='text'
              label={t('variantDetail.name')}
              value={newVariant.name}
              isValid={newVariant.isValidName}
              feedback={t('variantDetail.validName')}
              required
              validator='anything'
              onChange={(value) => handleChange('name', 'isValidName', value)}
              onValidate={(flag) => handleValidate('isValidName', flag)}
            />
          </div>
          {error && (
            <div className='col-12 px-4 mt-2'>
              <Error msg={error} />
            </div>
          )}
        </div>
        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 row px-4 my-3 p-3 sticky-bottom`}
        >
          <div className='d-flex justify-content-end align-items-center gap-3'>
            <Link
              to='/admin/variant'
              className='btn btn-outline-primary ripple rounded-1'
              style={{ width: '200px', maxWidth: '100%' }}
              onClick={handleBack}
            >
              {t('button.cancel')}
            </Link>
            <button
              type='submit'
              className='btn btn-primary ripple rounded-1'
              style={{ width: '300px', maxWidth: '100%' }}
            >
              {t('button.submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminCreateVariantForm

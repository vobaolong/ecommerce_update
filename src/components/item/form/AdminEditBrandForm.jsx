import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { updateBrand, getBrandById } from '../../../apis/brand.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import ConfirmDialog from '../../ui/ConfirmDialog'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const AdminEditBrandForm = ({ brandId = '' }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [newBrand, setNewBrand] = useState({
    name: '',
    categoryIds: [],
    defaultParentCategories: [],
    isValidName: true
  })
  const { _id, accessToken } = getToken()

  const fetchBrand = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await getBrandById(_id, accessToken, brandId)
      if (data.error) throw new Error(data.error)
      setNewBrand({
        name: data.brand.name,
        defaultParentCategories: data.brand.categoryIds,
        categoryIds: data.brand.categoryIds.map((category) => category._id),
        isValidName: true
      })
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [_id, accessToken, brandId])

  useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

  const handleChange = useCallback((name, isValidName, value) => {
    setNewBrand((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setNewBrand((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { name, categoryIds } = newBrand
      if (!name || !categoryIds.length) {
        setNewBrand((prev) => ({
          ...prev,
          isValidName: regexTest('anything', name)
        }))
        return
      }
      if (!newBrand.isValidName) return
      setIsConfirming(true)
    },
    [newBrand]
  )

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await updateBrand(_id, accessToken, brandId, newBrand)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.brand.update'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, brandId, newBrand, t])

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.edit')}
          onSubmit={onSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form
        className='border bg-body rounded-1 row mb-2'
        onSubmit={handleSubmit}
      >
        <div className='col-12 bg-primary rounded-top-1 px-4 py-3'>
          <h1 className='text-white fs-5 m-0'>{t('brandDetail.edit')}</h1>
        </div>
        <div className='col-12 mt-4 px-4'>
          <MultiCategorySelector
            label={t('categoryDetail.chosenParentCategory')}
            isActive={false}
            isRequired
            defaultValue={newBrand.defaultParentCategories}
            onSet={(categories) =>
              handleChange(
                'categoryIds',
                'isValidName',
                categories ? categories.map((c) => c._id) : []
              )
            }
          />
        </div>
        <div className='col-12 px-4 mt-2'>
          <Input
            type='text'
            required
            label={t('brandDetail.name')}
            value={newBrand.name}
            isValid={newBrand.isValidName}
            feedback={t('categoryValid.validBrand')}
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
        <div className='col-12 px-4 pb-3 mt-4 d-flex justify-content-between align-items-center gap-3'>
          <Link
            to='/admin/brand'
            className='text-decoration-none cus-link-hover'
          >
            {t('button.back')}
          </Link>
          <button
            type='submit'
            className='btn btn-primary ripple rounded-1'
            style={{ width: '300px', maxWidth: '100%' }}
          >
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditBrandForm

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { updateCategory, getCategoryById } from '../../../apis/category.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const AdminEditCategoryForm = ({ categoryId = '' }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    categoryId: '',
    defaultParentCategory: '',
    defaultSrc: '',
    isValidName: true,
    isValidImage: true
  })
  const { _id, accessToken } = getToken()

  const fetchCategory = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await getCategoryById(categoryId)
      if (data.error) throw new Error(data.error)
      setNewCategory({
        name: data.category.name,
        image: '',
        categoryId: data.category.categoryId?._id || '',
        defaultParentCategory: data.category.categoryId || '',
        defaultSrc: data.category.image,
        isValidName: true,
        isValidImage: true
      })
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  const handleChange = useCallback((name, isValidName, value) => {
    setNewCategory((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setNewCategory((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { name } = newCategory
      if (!name || !newCategory.isValidName || !newCategory.isValidImage) {
        setNewCategory((prev) => ({
          ...prev,
          isValidName: regexTest('anything', name)
        }))
        return
      }
      setIsConfirmingUpdate(true)
    },
    [newCategory]
  )

  const onSubmit = useCallback(async () => {
    const formData = new FormData()
    formData.set('name', newCategory.name)
    if (newCategory.image) formData.set('image', newCategory.image)
    if (newCategory.categoryId)
      formData.set('categoryId', newCategory.categoryId)

    setError('')
    setIsLoading(true)
    try {
      const data = await updateCategory(_id, accessToken, categoryId, formData)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.category.update'))
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, categoryId, newCategory, t])

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirmingUpdate && (
        <ConfirmDialog
          title={t('dialog.updateCategory')}
          onSubmit={onSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirmingUpdate(false)}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t('dialog.cancelUpdate')}
          onSubmit={() => window.history.back()}
          message={t('confirmDialog')}
          onClose={() => setIsConfirmingBack(false)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className='row bg-body rounded-1 box-shadow'>
          <div className='col-12 bg-primary p-3 rounded-top-2'>
            <h1 className='text-white fs-5 m-0'>{t('categoryDetail.edit')}</h1>
          </div>
          <div className='col-12 px-4 mt-4'>
            <CategorySelector
              label={t('categoryDetail.chosenParentCategory')}
              selected='parent'
              isActive={false}
              defaultValue={newCategory.defaultParentCategory}
              onSet={(category) =>
                handleChange('categoryId', 'isValidName', category._id)
              }
            />
          </div>
          <div className='col-12 px-4 mt-4'>
            <Input
              type='text'
              label={t('categoryDetail.name')}
              value={newCategory.name}
              isValid={newCategory.isValidName}
              feedback={t('categoryValid.validName')}
              validator='anything'
              required
              onChange={(value) => handleChange('name', 'isValidName', value)}
              onValidate={(flag) => handleValidate('isValidName', flag)}
            />
          </div>
          <div className='col-12 px-4 mt-4'>
            <p>
              {t('categoryDetail.img')} <sup className='text-danger'>*</sup>
            </p>
            <InputFile
              size='avatar'
              noRadius
              defaultSrc={newCategory.defaultSrc}
              value={newCategory.image}
              isValid={newCategory.isValidImage}
              feedback={t('categoryValid.validImg')}
              accept='image/jpg, image/jpeg, image/png, image/gif, image/webp'
              onChange={(value) => handleChange('image', 'isValidImage', value)}
              onValidate={(flag) => handleValidate('isValidImage', flag)}
            />
          </div>
          {error && (
            <div className='col-12 px-4 mt-2'>
              <Error msg={error} />
            </div>
          )}
        </div>
        <div className='bg-body shadow rounded-1 row px-4 my-3 p-3 sticky-bottom'>
          <div className='d-flex justify-content-between align-items-center gap-3'>
            <Link
              to='/admin/category'
              className='text-decoration-none cus-link-hover'
              onClick={() => setIsConfirmingBack(true)}
            >
              <i className='fa-solid fa-angle-left'></i> {t('button.back')}
            </Link>
            <button
              type='submit'
              className='btn btn-primary ripple rounded-1'
              style={{ width: '200px', maxWidth: '100%' }}
            >
              {t('button.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminEditCategoryForm

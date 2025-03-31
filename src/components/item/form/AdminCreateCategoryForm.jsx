import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createCategory } from '../../../apis/category.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Feedback'

const AdminCreateCategoryForm = () => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    categoryId: '',
    isValidName: true,
    isValidImage: true
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
  const confirmBack = useCallback(() => navigate('/admin/category'), [navigate])

  const handleChange = useCallback((name, isValidName, value) => {
    setNewCategory((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setNewCategory((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!newCategory.name || !newCategory.isValidName) {
        setNewCategory((prev) => ({
          ...prev,
          isValidName: regexTest('anything', prev.name)
        }))
        return
      }
      setIsConfirming(true)
    },
    [newCategory]
  )

  const onSubmit = useCallback(async () => {
    const formData = new FormData()
    formData.set('name', newCategory.name)
    if (newCategory.categoryId)
      formData.set('categoryId', newCategory.categoryId)
    if (newCategory.image) formData.set('image', newCategory.image)

    setError('')
    setIsLoading(true)
    try {
      const data = await createCategory(_id, accessToken, formData)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.category.create'))
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, newCategory, t])

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.add')}
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
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className='row bg-body rounded-1 box-shadow'>
          <div className='col-12 bg-primary p-3 rounded-top-2'>
            <h1 className='text-white fs-5 m-0'>{t('categoryDetail.add')}</h1>
          </div>
          <div className='col-12 mt-4 px-4'>
            <p>{t('categoryDetail.selectLargeCategory')}</p>
            <CategorySelector
              label={t('categoryDetail.selectLargeCategory')}
              selected='parent'
              isActive={false}
              onSet={(category) =>
                handleChange('categoryId', 'isValidName', category._id)
              }
            />
          </div>
          <div className='col-12 px-4 mt-2'>
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
          <div className='col-12 px-4 mt-2'>
            <InputFile
              label={t('categoryDetail.img')}
              size='avatar'
              noRadius
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
        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 row px-4 my-3 p-3 sticky-bottom`}
        >
          <div className='d-flex justify-content-end align-items-center gap-3'>
            <Link
              to='/admin/category'
              className='btn btn-outline-primary ripple rounded-1'
              style={{ width: '200px', maxWidth: '100%' }}
              onClick={handleBack}
            >
              {t('button.cancel')}
            </Link>
            <button
              type='submit'
              className='btn btn-primary ripple rounded-1'
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

export default AdminCreateCategoryForm

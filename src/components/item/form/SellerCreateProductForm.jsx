/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createProduct } from '../../../apis/product.api'
import { listBrandByCategory } from '../../../apis/brand.api'
import { regexTest, numberTest } from '../../../helper/test'
import Input from '../../ui/Input'
import InputFile from '../../ui/InputFile'
import TextArea from '../../ui/TextArea'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import CategorySelector from '../../selector/CategorySelector'
import VariantSelector from '../../selector/VariantSelector'
import DropDownMenu from '../../ui/DropDownMenu'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const SellerCreateProductForm = ({ storeId = '' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [error, setError] = useState('')
  const [isConfirmingBack, setIsConfirmingBack] = useState(false)
  const [isConfirmingCreate, setIsConfirmingCreate] = useState(false)
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState({ value: '', label: '' })
  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: '',
    brandId: '',
    image0: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    image6: '',
    description: '',
    quantity: 0,
    price: 0,
    salePrice: 0,
    variantValueIds: [],
    isValidName: true,
    isValidImage0: true,
    isValidImage1: true,
    isValidImage2: true,
    isValidImage3: true,
    isValidImage4: true,
    isValidImage5: true,
    isValidImage6: true,
    isValidDescription: true,
    isValidQuantity: true,
    isValidPrice: true,
    isValidSalePrice: true
  })
  const { t } = useTranslation()
  const { _id, accessToken } = getToken()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.innerHeight + window.scrollY < document.body.offsetHeight
      )
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchBrands = useCallback(
    async (categoryId) => {
      if (!categoryId) return
      setIsLoading(true)
      try {
        const data = await listBrandByCategory(categoryId)
        if (data.error) throw new Error(data.error)
        const brandOptions = data.brands.length
          ? data.brands.map((brand) => ({
              value: brand._id,
              label: brand.name
            }))
          : [{ value: '', label: t('productDetail.noBrand') }]
        setBrands(brandOptions)
      } catch (err) {
        setError(err.message || 'Server Error')
      } finally {
        setIsLoading(false)
      }
    },
    [t]
  )

  useEffect(() => {
    if (newProduct.categoryId) fetchBrands(newProduct.categoryId)
  }, [newProduct.categoryId, fetchBrands])

  const handleChange = useCallback((name, isValidName, value) => {
    setNewProduct((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setNewProduct((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrand(brand)
    setNewProduct((prev) => ({ ...prev, brandId: brand.value }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const {
        name,
        categoryId,
        image0,
        description,
        quantity,
        price,
        salePrice
      } = newProduct

      if (
        !name ||
        !categoryId ||
        !image0 ||
        !description ||
        !quantity ||
        !price ||
        !salePrice
      ) {
        setNewProduct((prev) => ({
          ...prev,
          isValidName: regexTest('anything', name),
          isValidImage0: !!image0,
          isValidDescription: regexTest('bio', description),
          isValidQuantity: numberTest('positive|zero', quantity),
          isValidPrice: numberTest('positive|zero', price),
          isValidSalePrice: numberTest('positive|zero', salePrice)
        }))
        return
      }

      if (
        !newProduct.isValidName ||
        !newProduct.isValidImage0 ||
        !newProduct.isValidDescription ||
        !newProduct.isValidQuantity ||
        !newProduct.isValidPrice ||
        !newProduct.isValidSalePrice
      )
        return

      if (parseFloat(salePrice) > parseFloat(price)) {
        setError(t('productValid.salePriceCannotBeGreaterThan'))
        return
      }

      setIsConfirmingCreate(true)
    },
    [newProduct, t]
  )

  const onSubmit = useCallback(async () => {
    const formData = new FormData()
    formData.set('name', newProduct.name)
    formData.set('description', newProduct.description)
    formData.set('quantity', newProduct.quantity)
    formData.set('price', newProduct.price)
    formData.set('salePrice', newProduct.salePrice)
    formData.set('image0', newProduct.image0)
    formData.set('categoryId', newProduct.categoryId)
    if (newProduct.brandId) formData.set('brandId', newProduct.brandId)
    if (newProduct.variantValueIds.length)
      formData.set('variantValueIds', newProduct.variantValueIds.join('|'))
    ;['image1', 'image2', 'image3', 'image4', 'image5', 'image6'].forEach(
      (key) => {
        if (newProduct[key]) formData.set(key, newProduct[key])
      }
    )

    setError('')
    setIsLoading(true)
    try {
      const data = await createProduct(_id, accessToken, formData, storeId)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.product.create'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Server Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, newProduct, storeId, t])

  const handleBackClick = useCallback((e) => {
    e.preventDefault()
    setIsConfirmingBack(true)
  }, [])

  const handleConfirmBack = useCallback(() => {
    setIsConfirmingBack(false)
    window.history.back()
  }, [])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirmingCreate && (
        <ConfirmDialog
          title={t('productDetail.createProduct')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirmingCreate(false)}
          message={t('confirmDialog')}
        />
      )}
      {isConfirmingBack && (
        <ConfirmDialog
          title={t('dialog.cancelCreate')}
          onSubmit={handleConfirmBack}
          color='danger'
          onClose={() => setIsConfirmingBack(false)}
          message={t('confirmDialog')}
        />
      )}

      <form
        className='accordion'
        id='accordionPanelsStayOpen'
        onSubmit={handleSubmit}
      >
        <div className='accordion-item'>
          <h2 className='accordion-header' id='panelsStayOpen-heading-1'>
            <button
              className='accordion-button btn'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#panelsStayOpen-collapse-1'
              aria-expanded='true'
              aria-controls='panelsStayOpen-collapse-1'
            >
              1. {t('productDetail.basicInfo')}
            </button>
          </h2>
          <div
            id='panelsStayOpen-collapse-1'
            className='accordion-collapse collapse show'
            aria-labelledby='panelsStayOpen-heading-1'
          >
            <div className='accordion-body'>
              <div className='col-12'>
                <Input
                  type='text'
                  label={t('productDetail.name')}
                  value={newProduct.name}
                  isValid={newProduct.isValidName}
                  feedback={t('productValid.validName')}
                  validator='anything'
                  required
                  placeholder={t('productDetail.namePlaceholder')}
                  onChange={(value) =>
                    handleChange('name', 'isValidName', value)
                  }
                  onValidate={(flag) => handleValidate('isValidName', flag)}
                />
              </div>
              <div className='col-12 mt-3'>
                <p>
                  {t('productDetail.chooseCategory')}{' '}
                  <span className='text-danger'>*</span>
                </p>
                <CategorySelector
                  label={t('productDetail.selectedCategory')}
                  isActive
                  isRequired
                  onSet={(category) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      categoryId: category._id
                    }))
                  }
                />
              </div>
              <div className='col-12 mt-3'>
                <DropDownMenu
                  listItem={brands}
                  value={selectedBrand}
                  setValue={handleBrandChange}
                  label={t('productDetail.chooseBrand')}
                  size='lg'
                />
              </div>
              <div className='col-12 mt-3'>
                <p>{t('productDetail.productImg')}</p>
                <div className='d-flex flex-wrap justify-content-start gap-4 align-items-center'>
                  {[
                    'image0',
                    'image1',
                    'image2',
                    'image3',
                    'image4',
                    'image5',
                    'image6'
                  ].map((key, idx) => (
                    <InputFile
                      key={key}
                      label={
                        idx === 0
                          ? t('productDetail.thumbImg')
                          : t(`productDetail.img${idx}`)
                      }
                      size='avatar'
                      noRadius={false}
                      value={newProduct[key]}
                      isValid={
                        newProduct[
                          `isValid${key.charAt(0).toUpperCase() + key.slice(1)}`
                        ]
                      }
                      feedback={
                        idx === 0
                          ? t('productValid.avatarValid')
                          : t('productValid.otherValid')
                      }
                      accept='image/jpg, image/jpeg, image/png, image/gif, image/webp'
                      onChange={(value) =>
                        handleChange(
                          key,
                          `isValid${
                            key.charAt(0).toUpperCase() + key.slice(1)
                          }`,
                          value
                        )
                      }
                      onValidate={(flag) =>
                        handleValidate(
                          `isValid${
                            key.charAt(0).toUpperCase() + key.slice(1)
                          }`,
                          flag
                        )
                      }
                      required={idx === 0}
                    />
                  ))}
                </div>
              </div>
              <div className='col-12 mb-3'>
                <TextArea
                  label={t('productDetail.description')}
                  value={newProduct.description}
                  isValid={newProduct.isValidDescription}
                  required
                  feedback={t('productValid.validDescription')}
                  placeholder={t('productDetail.descriptionPlaceholder')}
                  validator='bio'
                  onChange={(value) =>
                    handleChange('description', 'isValidDescription', value)
                  }
                  onValidate={(flag) =>
                    handleValidate('isValidDescription', flag)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className='accordion-item mt-3'>
          <h2 className='accordion-header' id='panelsStayOpen-heading-2'>
            <button
              className='accordion-button btn'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#panelsStayOpen-collapse-2'
              aria-expanded='true'
              aria-controls='panelsStayOpen-collapse-2'
            >
              2. {t('productDetail.detailInfo')}
            </button>
          </h2>
          <div
            id='panelsStayOpen-collapse-2'
            className='accordion-collapse collapse show'
            aria-labelledby='panelsStayOpen-heading-2'
          >
            <div className='accordion-body row'>
              <div className='col-md-6 col-sm-12'>
                <Input
                  type='number'
                  label={`${t('productDetail.price')} (₫)`}
                  value={newProduct.price}
                  isValid={newProduct.isValidPrice}
                  feedback={t('productValid.priceValid')}
                  validator='positive|zero'
                  required
                  onChange={(value) =>
                    handleChange('price', 'isValidPrice', value)
                  }
                  onValidate={(flag) => handleValidate('isValidPrice', flag)}
                />
              </div>
              <div className='col-md-6 col-sm-12'>
                <Input
                  type='number'
                  label={`${t('productDetail.salePrice')} (₫)`}
                  value={newProduct.salePrice}
                  isValid={newProduct.isValidSalePrice}
                  feedback={t('productValid.salePriceValid')}
                  validator='positive|zero'
                  required
                  onChange={(value) =>
                    handleChange('salePrice', 'isValidSalePrice', value)
                  }
                  onValidate={(flag) =>
                    handleValidate('isValidSalePrice', flag)
                  }
                />
              </div>
              <div className='col-12'>
                <Input
                  type='number'
                  label={t('productDetail.quantity')}
                  value={newProduct.quantity}
                  isValid={newProduct.isValidQuantity}
                  feedback={t('productValid.quantityValid')}
                  required
                  validator='positive|zero'
                  onChange={(value) =>
                    handleChange('quantity', 'isValidQuantity', value)
                  }
                  onValidate={(flag) => handleValidate('isValidQuantity', flag)}
                />
              </div>
              <div className='col-12 mt-3'>
                <span className='px-2'>
                  {t('productDetail.chooseStyles')}{' '}
                  <small className='text-muted'>
                    {t('productDetail.chooseCateFirst')}
                  </small>
                </span>
                <VariantSelector
                  label={t('productDetail.selectedVariants')}
                  categoryId={newProduct.categoryId}
                  onSet={(variantValues) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      variantValueIds: variantValues.map((v) => v._id)
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='col-12 p-2 text-center'>
            <Error msg={error} />
          </div>
        )}
        <div
          className={`bg-body ${
            isScrolled ? 'shadow' : 'box-shadow'
          } rounded-1 px-4 my-3 p-3`}
          style={{ position: 'sticky', bottom: 0 }}
        >
          <div className='d-flex justify-content-end gap-4 align-items-center'>
            <Link
              to={`/seller/products/${storeId}`}
              className='btn btn-outline-primary ripple rounded-1'
              onClick={handleBackClick}
            >
              {t('button.cancel')}
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

export default SellerCreateProductForm

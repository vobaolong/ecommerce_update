import { useState, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { createStoreLevel } from '../../../apis/level.api'
import { regexTest, numberTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import ColorPickerInput from '../../ui/ColorPickerInput'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const AdminCreateStoreLevelForm = ({ onRun = () => {} }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [level, setLevel] = useState({
    name: '',
    minPoint: 0,
    discount: 0,
    color: '',
    isValidName: true,
    isValidMinPoint: true,
    isValidDiscount: true,
    isValidColor: true
  })
  const { _id, accessToken } = getToken()

  const handleChange = useCallback((name, isValidName, value) => {
    setLevel((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setLevel((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { name, minPoint, discount, color } = level
      if (!name || minPoint === '' || discount === '' || !color) {
        setLevel((prev) => ({
          ...prev,
          isValidName: regexTest('name', name),
          isValidMinPoint:
            numberTest('positive', minPoint) || numberTest('zero', minPoint),
          isValidDiscount: numberTest('zeroTo100', discount),
          isValidColor: regexTest('anything', color)
        }))
        return
      }
      if (
        !level.isValidName ||
        !level.isValidMinPoint ||
        !level.isValidDiscount ||
        !level.isValidColor
      )
        return
      setIsConfirming(true)
    },
    [level]
  )

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await createStoreLevel(_id, accessToken, level)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.level.create'))
      setLevel({
        name: '',
        minPoint: 0,
        discount: 0,
        color: '',
        isValidName: true,
        isValidMinPoint: true,
        isValidDiscount: true,
        isValidColor: true
      })
      onRun()
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, level, onRun, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.createStoreLevel')}
          onSubmit={onSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('levelDetail.name')}
            value={level.name}
            isValid={level.isValidName}
            feedback={t('levelDetail.validName')}
            validator='level'
            required
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='number'
            label={t('levelDetail.floorPoint')}
            value={level.minPoint}
            isValid={level.isValidMinPoint}
            feedback={t('levelDetail.validFloorPoint')}
            validator='positive|zero'
            required
            onChange={(value) =>
              handleChange('minPoint', 'isValidMinPoint', value)
            }
            onValidate={(flag) => handleValidate('isValidMinPoint', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='number'
            label={`${t('levelDetail.discount')} (%)`}
            value={level.discount}
            isValid={level.isValidDiscount}
            feedback={t('levelDetail.validDiscount')}
            validator='zeroTo100'
            required
            onChange={(value) =>
              handleChange('discount', 'isValidDiscount', value)
            }
            onValidate={(flag) => handleValidate('isValidDiscount', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <ColorPickerInput
            label={t('levelDetail.color')}
            color={level.color}
            onChange={(selectedColor) =>
              handleChange('color', 'isValidColor', selectedColor)
            }
          />
        </div>
        {error && (
          <div className='col-12 mt-3'>
            <Error msg={error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminCreateStoreLevelForm

import { useState, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import { createCommission } from '../../../apis/commission.api'
import { regexTest, numberTest } from '../../../helper/test'
import TextArea from '../../ui/TextArea'
import Input from '../../ui/Input'
import Error from '../../ui/Feedback'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const AdminCreateCommissionForm = ({ onRun = () => {} }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [commission, setCommission] = useState({
    name: '',
    description: '',
    fee: 0,
    isValidName: true,
    isValidDescription: true,
    isValidFee: true
  })
  const { _id, accessToken } = getToken()

  const handleChange = useCallback((name, isValidName, value) => {
    setCommission((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setCommission((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { name, description, fee } = commission
      if (!name || !description || fee === '') {
        setCommission((prev) => ({
          ...prev,
          isValidName: regexTest('name', name),
          isValidDescription: regexTest('bio', description),
          isValidFee: numberTest('zeroTo100', fee)
        }))
        return
      }
      if (
        !commission.isValidName ||
        !commission.isValidDescription ||
        !commission.isValidFee
      )
        return
      setIsConfirming(true)
    },
    [commission]
  )

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await createCommission(_id, accessToken, commission)
      if (data.error) throw new Error(data.error)
      toast.success(t('toastSuccess.commission.create'))
      setCommission({
        name: '',
        description: '',
        fee: 0,
        isValidName: true,
        isValidDescription: true,
        isValidFee: true
      })
      onRun()
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [_id, accessToken, commission, onRun, t])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.createCommission')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('commissionDetail.name')}
            value={commission.name}
            isValid={commission.isValidName}
            feedback={t('commissionDetail.validName')}
            validator='bio'
            required
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='number'
            label={`${t('commissionDetail.fee')} (%)`}
            value={commission.fee}
            isValid={commission.isValidFee}
            feedback={t('commissionDetail.feeValid')}
            validator='zeroTo100'
            required
            onChange={(value) => handleChange('fee', 'isValidFee', value)}
            onValidate={(flag) => handleValidate('isValidFee', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <TextArea
            label={t('commissionDetail.description')}
            value={commission.description}
            isValid={commission.isValidDescription}
            feedback={t('commissionDetail.validDescription')}
            validator='bio'
            required
            onChange={(value) =>
              handleChange('description', 'isValidDescription', value)
            }
            onValidate={(flag) => handleValidate('isValidDescription', flag)}
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

export default AdminCreateCommissionForm

import { useState, useCallback } from 'react'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { createTransactionByStore } from '../../../apis/transaction.api'
import { regexTest, numberTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Error from '../../ui/Feedback'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const CreateDepositTransactionForm = ({ eWallet = 0, storeId = '', onRun }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const { _id: userId, accessToken } = getToken()
  const [transaction, setTransaction] = useState({
    isUp: 'true',
    amount: 10000000,
    currentPassword: '',
    isValidAmount: true,
    isValidCurrentPassword: true
  })

  const handleChange = useCallback((name, isValidName, value) => {
    setTransaction((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setTransaction((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { amount, currentPassword } = transaction
      if (!userId || !storeId || !amount || !currentPassword) {
        setTransaction((prev) => ({
          ...prev,
          isValidAmount:
            numberTest('positive', amount) &&
            parseFloat(amount) <= parseFloat(eWallet),
          isValidCurrentPassword: regexTest('password', currentPassword)
        }))
        return
      }
      if (!transaction.isValidAmount || !transaction.isValidCurrentPassword)
        return
      setIsConfirming(true)
    },
    [transaction, userId, storeId, eWallet]
  )

  const onSubmit = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await createTransactionByStore(
        userId,
        accessToken,
        transaction,
        storeId
      )
      if (data.error) throw new Error(data.error)
      setTransaction((prev) => ({
        ...prev,
        amount: 100000,
        currentPassword: '',
        isValidAmount: true,
        isValidCurrentPassword: true
      }))
      updateDispatch('seller', data.store)
      toast.success(t('toastSuccess.withdraw'))
      onRun?.()
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(''), 3000)
    }
  }, [userId, accessToken, transaction, storeId, updateDispatch, t, onRun])

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('title.createTransaction')}
          onSubmit={onSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='number'
            label={`${t('transactionDetail.amount')} (₫)`}
            value={transaction.amount}
            isValid={transaction.isValidAmount}
            required
            feedback={t('transactionDetail.amountValid')}
            validator='positive'
            onChange={(value) => handleChange('amount', 'isValidAmount', value)}
            onValidate={(flag) => handleValidate('isValidAmount', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('transactionDetail.currentPw')}
            value={transaction.currentPassword}
            required
            isValid={transaction.isValidCurrentPassword}
            feedback={t('transactionDetail.currentPwValid')}
            validator='password'
            onChange={(value) =>
              handleChange('currentPassword', 'isValidCurrentPassword', value)
            }
            onValidate={(flag) =>
              handleValidate('isValidCurrentPassword', flag)
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

export default CreateDepositTransactionForm

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createOrder } from '../../../apis/order.api'
import { getStoreLevel } from '../../../apis/level.api'
import { getCommissionByStore } from '../../../apis/commission.api'
import { getAddressCache } from '../../../apis/address.api'
import Loading from '../../ui/Loading'
import Error from '../../ui/Feedback'
import ConfirmDialog from '../../ui/ConfirmDialog'
import UserAddAddressItem from '../../item/UserAddAddressItem'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { regexTest } from '../../../helper/test'
import { convertVNDtoUSD } from '../../../helper/formatPrice'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import vnpayImage from '../../../assets/vnpay-seeklogo.svg'
import {
  totalShippingFee,
  totalProducts,
  totalCommission
} from '../../../helper/total'
import { formatPrice } from '../../../helper/formatPrice'
import Logo from '../../layout/menu/Logo'
import Input from '../../ui/Input'
import DropDownMenu from '../../ui/DropDownMenu'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import defaultImg from '../../../assets/default.webp'
import axios from 'axios'
import { VNPay } from 'vnpay'
import { socketId } from '../../../utils/socket'
import { readableDate } from '../../../helper/readable'

const IMG = import.meta.env.VITE_STATIC_URL
const CLIENT_ID = import.meta.env.REACT_APP_PAYPAL_CLIENT_ID

const apiEndpointFee =
  'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'
const apiEndpointAvailableServices =
  'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services'
const headers = {
  Token: 'df39b10b-1767-11ef-bfe9-c2d25c6518ab',
  shop_id: '5080978'
}

const calculateShippingFee = async ({
  insuranceValue,
  fromDistrictId,
  fromWardCode,
  toDistrictId,
  toWardCode
}) => {
  try {
    const res = await axios.post(
      apiEndpointAvailableServices,
      {
        shop_id: 5080978,
        from_district: fromDistrictId,
        to_district: toDistrictId
      },
      { headers }
    )
    const serviceId = res.data.data?.[0].service_id ?? 53321

    const response = await axios.post(
      apiEndpointFee,
      {
        service_id: serviceId,
        insurance_value: insuranceValue,
        coupon: null,
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        height: 15,
        length: 15,
        weight: 1000,
        width: 15
      },
      { headers }
    )
    return response.data.data.total
  } catch (error) {
    console.error('Error calculating shipping fee:', error)
    return 0
  }
}

const CheckoutForm = ({
  cartId = '',
  storeId = '',
  storeAddress = '',
  items = {}
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState({})
  const [updateDispatch] = useUpdateDispatch()
  const navigate = useNavigate()
  const {
    firstName,
    lastName,
    phone,
    addresses,
    level: userLevel
  } = useSelector((state) => state.account.user)

  const init = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        getStoreLevel(storeId),
        getCommissionByStore(storeId),
        getAddressCache(encodeURIComponent(storeAddress)),
        getAddressCache(encodeURIComponent(order.address || addresses[0]))
      ])

      const { totalPrice, totalSalePrice, amountFromUser1 } = totalProducts(
        items,
        userLevel
      )
      const { amountFromStore, amountToStore } = totalCommission(
        items,
        res1.level,
        res2.commission
      )
      const shippingFeeBeforeDiscount = await calculateShippingFee({
        insuranceValue: totalPrice,
        fromDistrictId: res3.districtID ? Number(res3.districtID) : 3440,
        toDistrictId: res4.districtID ? Number(res4.districtID) : 3695,
        toWardCode: res4.wardID ?? '90758'
      })
      const { shippingFee } = totalShippingFee(
        shippingFeeBeforeDiscount,
        userLevel
      )
      const amountFromUser = amountFromUser1 + shippingFee

      setOrder({
        firstName,
        lastName,
        phone: order.phone ?? phone,
        address: order.address ?? addresses[0],
        isValidFirstName: true,
        isValidLastName: true,
        isValidPhone: true,
        cartId,
        shippingFeeBeforeDiscount,
        shippingFee,
        totalPrice,
        totalSalePrice,
        amountFromUser1,
        amountFromUser,
        amountFromStore,
        amountToStore,
        commissionId: res2.commission._id,
        amountToZenpii: amountFromUser - amountToStore
      })
    } catch {
      setError('Server Error')
    } finally {
      setIsLoading(false)
    }
  }, [
    cartId,
    storeId,
    storeAddress,
    items,
    firstName,
    lastName,
    phone,
    addresses,
    userLevel,
    order.address
  ])

  useEffect(() => {
    init()
  }, [init])

  const [paypalDisabled, setPaypalDisabled] = useState(true)
  useEffect(() => {
    setPaypalDisabled(
      !order.firstName || !order.lastName || !order.phone || !order.address
    )
  }, [order.firstName, order.lastName, order.phone, order.address])

  const handleChange = useCallback((name, isValidName, value) => {
    setOrder((prev) => ({ ...prev, [name]: value, [isValidName]: true }))
  }, [])

  const handleValidate = useCallback((isValidName, flag) => {
    setOrder((prev) => ({ ...prev, [isValidName]: flag }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const requiredFields = [
        'cartId',
        'commissionId',
        'firstName',
        'lastName',
        'phone',
        'address',
        'shippingFee',
        'amountFromUser',
        'amountFromStore',
        'amountToStore',
        'amountToZenpii'
      ]
      if (requiredFields.some((field) => !order[field])) {
        setOrder((prev) => ({
          ...prev,
          isValidFirstName: regexTest('name', prev.firstName),
          isValidLastName: regexTest('name', prev.lastName),
          isValidPhone: regexTest('phone', prev.phone)
        }))
        return
      }
      if (
        !order.isValidFirstName ||
        !order.isValidLastName ||
        !order.isValidPhone
      )
        return
      setIsConfirming(true)
    },
    [order]
  )

  const onSubmit = useCallback(() => {
    const { _id, accessToken } = getToken()
    const orderBody = {
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      address: order.address,
      shippingFee: order.shippingFee,
      commissionId: order.commissionId,
      amountFromUser: order.amountFromUser,
      amountFromStore: order.amountFromStore,
      amountToStore: order.amountToStore,
      amountToZenpii: order.amountToZenpii,
      isPaidBefore: false
    }

    setIsLoading(true)
    createOrder(_id, accessToken, cartId, orderBody)
      .then((data) => {
        if (data.error) throw new Error(data.error)
        updateDispatch('account', data.user)
        socketId.emit('notificationOrder', {
          objectId: data.order._id,
          from: _id,
          to: storeId
        })
        navigate('/account/purchase')
        toast.success(t('toastSuccess.order.create'))
      })
      .catch((err) => {
        setError(err.message || 'Server Error')
        setTimeout(() => setError(''), 3000)
      })
      .finally(() => setIsLoading(false))
  }, [order, cartId, storeId, navigate, t, updateDispatch])

  const handlePayPalCreateOrder = useCallback(
    (data, actions) => {
      const requiredFields = [
        'cartId',
        'commissionId',
        'firstName',
        'lastName',
        'phone',
        'shippingFee',
        'address',
        'amountFromUser',
        'amountFromStore',
        'amountToStore',
        'amountToZenpii'
      ]
      if (requiredFields.some((field) => !order[field])) {
        setOrder((prev) => ({
          ...prev,
          isValidFirstName: regexTest('name', prev.firstName),
          isValidLastName: regexTest('name', prev.lastName),
          isValidPhone: regexTest('phone', prev.phone)
        }))
        return
      }
      if (
        !order.isValidFirstName ||
        !order.isValidLastName ||
        !order.isValidPhone
      )
        return
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: convertVNDtoUSD(order.amountFromUser)
            }
          }
        ],
        application_context: { shipping_preference: 'NO_SHIPPING' }
      })
    },
    [order]
  )

  const handlePayPalApprove = useCallback(
    (data, actions) => {
      return actions.order.capture().then(() => {
        const { _id, accessToken } = getToken()
        const orderBody = {
          firstName: order.firstName,
          lastName: order.lastName,
          phone: order.phone,
          address: order.address,
          shippingFee: order.shippingFee,
          commissionId: order.commissionId,
          amountFromUser: order.amountFromUser,
          amountFromStore: order.amountFromStore,
          amountToStore: order.amountToStore,
          amountToZenpii: order.amountToZenpii,
          isPaidBefore: true
        }

        setIsLoading(true)
        createOrder(_id, accessToken, cartId, orderBody)
          .then((data) => {
            if (data.error) throw new Error(data.error)
            updateDispatch('account', data.user)
            socketId.emit('notificationOrder', {
              objectId: data.order._id,
              from: _id,
              to: storeId
            })
            navigate('/account/purchase')
          })
          .catch((err) => setError(err.message || 'Server Error'))
          .finally(() => setIsLoading(false))
      })
    },
    [order, cartId, storeId, navigate, updateDispatch]
  )

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('orderDetail.cod')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <div className='container-fluid'>
        <form className='rounded-1 row border' onSubmit={handleSubmit}>
          <div className='col-12 bg-primary rounded-top-1 p-2 px-3'>
            <Logo navFor='user' width='130px' />
          </div>

          <div className='col-xl-7 col-md-6'>
            <div className='row my-2 p-3 border bg-body rounded-1 ms-0'>
              <span className='fw-semibold col-12 fs-12'>
                {t('orderDetail.userReceiver')}
              </span>
              <hr className='my-2' />
              <div className='col-6 d-flex justify-content-between align-items-end'>
                <Input
                  type='text'
                  label={t('userDetail.firstName')}
                  value={order.firstName}
                  isValid={order.isValidFirstName}
                  feedback={t('userDetail.validFirstName')}
                  validator='name'
                  placeholder='Ví dụ: Nguyen Van'
                  required
                  onChange={(value) =>
                    handleChange('firstName', 'isValidFirstName', value)
                  }
                  onValidate={(flag) =>
                    handleValidate('isValidFirstName', flag)
                  }
                />
              </div>
              <div className='col-6 d-flex justify-content-between align-items-end'>
                <Input
                  type='text'
                  label={t('userDetail.lastName')}
                  value={order.lastName}
                  isValid={order.isValidLastName}
                  feedback={t('userDetail.validLastName')}
                  validator='name'
                  placeholder='Ví dụ: A'
                  required
                  onChange={(value) =>
                    handleChange('lastName', 'isValidLastName', value)
                  }
                  onValidate={(flag) => handleValidate('isValidLastName', flag)}
                />
                <div className='d-inline-block position-relative ms-4'>
                  <div className='d-inline-block cus-tooltip'>
                    <button
                      className='btn btn-primary ripple rounded-1'
                      type='button'
                      disabled={!firstName || !lastName}
                      onClick={() =>
                        setOrder((prev) => ({
                          ...prev,
                          firstName,
                          lastName,
                          isValidFirstName: true,
                          isValidLastName: true
                        }))
                      }
                    >
                      <i className='fa-light fa-user-large'></i>
                    </button>
                  </div>
                  <small className='cus-tooltip-msg'>
                    {t('orderDetail.useRegisterLastName')}
                  </small>
                </div>
              </div>
              <div className='col-12 mt-2 d-flex justify-content-between align-items-end'>
                <Input
                  type='text'
                  label={t('userDetail.phone')}
                  value={order.phone}
                  isValid={order.isValidPhone}
                  feedback={t('userDetail.phoneValid')}
                  validator='phone'
                  placeholder='Ví dụ: 098***3433'
                  required
                  onChange={(value) =>
                    handleChange('phone', 'isValidPhone', value)
                  }
                  onValidate={(flag) => handleValidate('isValidPhone', flag)}
                />
                <div className='d-inline-block position-relative ms-4'>
                  <div className='d-inline-block cus-tooltip'>
                    <button
                      className='btn btn-primary ripple rounded-1'
                      type='button'
                      disabled={!phone}
                      onClick={() =>
                        setOrder((prev) => ({
                          ...prev,
                          phone,
                          isValidPhone: true
                        }))
                      }
                    >
                      <i className='fa-light fa-phone'></i>
                    </button>
                  </div>
                  <small className='cus-tooltip-msg'>
                    {t('orderDetail.useRegisterPhone')}
                  </small>
                </div>
              </div>
              <div className='col-12 mt-2 d-flex justify-content-between align-items-end'>
                <DropDownMenu
                  borderBtn={false}
                  required
                  listItem={
                    addresses?.map((a) => ({ value: a, label: a })) || []
                  }
                  value={{ value: order.address, label: order.address }}
                  setValue={(item) =>
                    setOrder((prev) => ({ ...prev, address: item.value }))
                  }
                  size='lg'
                  label={t('userDetail.address')}
                />
                {addresses?.length <= 0 && (
                  <small style={{ marginTop: '-20px', display: 'block' }}>
                    <Error msg='Vui lòng chọn địa chỉ nhận hàng' />
                  </small>
                )}
                <div className='mb-2 ms-4 position-relative'>
                  <UserAddAddressItem
                    count={addresses?.length}
                    detail={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-5 col-md-6'>
            <div className='my-2 p-3 border bg-body rounded-1'>
              <span
                style={{ fontSize: '1.2rem' }}
                className='fw-semibold px-2 col-12'
              >
                {t('cartDetail.yourOrder')}
              </span>
              <hr className='my-2' />
              <dl className='row px-2'>
                {items.map((item) => (
                  <React.Fragment key={item.productId?._id}>
                    <dt className='col-8 text-secondary fw-normal d-flex align-items-start gap-1 mb-1'>
                      <img
                        src={
                          item.productId?.listImages[0]
                            ? `${IMG}${item.productId.listImages[0]}`
                            : defaultImg
                        }
                        alt={item.productId?.name}
                        className='rounded-2 border w-20'
                      />
                      <small className='product-name'>
                        {item.productId?.name}
                      </small>
                      <span className='text-nowrap'>x {item.count}</span>
                    </dt>
                    <dd className='col-4 text-end'>
                      <span className='fs-6'>
                        {formatPrice(
                          item.productId?.salePrice?.$numberDecimal * item.count
                        )}
                        <sup>₫</sup>
                      </span>
                    </dd>
                  </React.Fragment>
                ))}
                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.subTotal')}
                </dt>
                <dd className='col-5 text-end'>
                  <span className='fs-6'>
                    {formatPrice(order.totalSalePrice ?? 0)}
                    <sup>₫</sup>
                  </span>
                </dd>
                {order.totalSalePrice - order.amountFromUser1 > 0 && (
                  <>
                    <dt className='col-7 text-secondary fw-normal'>
                      {t('cartDetail.zenpiiVoucherApplied')}
                    </dt>
                    <dd className='col-5 text-end'>
                      <span className='fs-6'>
                        -{' '}
                        {formatPrice(
                          order.totalSalePrice - order.amountFromUser1 || 0
                        )}
                        <sup>₫</sup>
                      </span>
                    </dd>
                  </>
                )}
                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.shippingFee')}
                </dt>
                <dd className='col-5 text-end'>
                  <span className='fs-6'>
                    {formatPrice(order.shippingFeeBeforeDiscount ?? 0)}
                    <sup>₫</sup>
                  </span>
                </dd>
                {order.shippingFeeBeforeDiscount - order.shippingFee > 0 && (
                  <>
                    <dt className='col-7 text-secondary fw-normal'>
                      {t('cartDetail.discountShippingFee')}
                    </dt>
                    <dd className='col-5 text-end'>
                      <span className='fs-6'>
                        -{' '}
                        {formatPrice(
                          order.shippingFeeBeforeDiscount - order.shippingFee
                        )}
                        <sup>₫</sup>
                      </span>
                    </dd>
                  </>
                )}
                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.total')}
                </dt>
                <dd className='col-5 text-end'>
                  <span className='text-primary fw-bold fs-6'>
                    {formatPrice(order.amountFromUser ?? 0)}
                    <sup>₫</sup>
                  </span>
                </dd>
              </dl>

              {error && (
                <div className='my-1'>
                  <Error msg={error} />
                </div>
              )}

              <div className='mt-2'>
                <button
                  type='submit'
                  className='btn btn-primary btn-lg ripple w-100 mb-1'
                  disabled={!order.address || !order.phone}
                >
                  {t('orderDetail.cod')}
                </button>

                <PayPalScriptProvider options={{ 'client-id': CLIENT_ID }}>
                  <PayPalButtons
                    style={{ layout: 'horizontal', tagline: false }}
                    disabled={paypalDisabled}
                    createOrder={handlePayPalCreateOrder}
                    onApprove={handlePayPalApprove}
                    onError={(err) => setError(String(err).slice(0, 300))}
                    onCancel={() => setIsLoading(false)}
                  />
                </PayPalScriptProvider>

                <button
                  type='button'
                  className='btn btn-default hover:bg-blue-100 border-solid border border-blue-700 border-2 btn-lg ripple w-100 mb-1 p-0'
                  disabled={!order.address || !order.phone}
                  onClick={async () => {
                    const vnpay = new VNPay({
                      tmnCode: 'M81536UR',
                      secureSecret: 'EU2OYS5JSUY59EUS9TSMOV1U9PI4L466',
                      vnpayHost: 'https://sandbox.vnpayment.vn',
                      testMode: true,
                      hashAlgorithm: 'SHA512'
                    })
                    const date = new Date()
                    const tnx = readableDate(date)
                    const urlString = vnpay.buildPaymentUrl({
                      vnp_Amount: order.amountFromUser,
                      vnp_IpAddr: '192.168.0.1',
                      vnp_ReturnUrl: `http://localhost:3000/cart?isOrder=true&cartId=${cartId}&storeId=${storeId}`,
                      vnp_TxnRef: tnx,
                      vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`
                    })

                    const orderBody = {
                      firstName: order.firstName,
                      lastName: order.lastName,
                      phone: order.phone,
                      address: order.address,
                      commissionId: order.commissionId,
                      shippingFee: order.shippingFee,
                      amountFromUser: order.amountFromUser,
                      amountFromStore: order.amountFromStore,
                      amountToStore: order.amountToStore,
                      amountToZenpii: order.amountToZenpii,
                      isPaidBefore: true
                    }
                    localStorage.setItem('order', JSON.stringify(orderBody))
                    window.location.href = urlString
                  }}
                >
                  <img src={vnpayImage} alt='vn pay' width={100} height={50} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm

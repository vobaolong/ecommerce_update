import { BrowserRouter, Routes, Route } from 'react-router'
import PrivateRoute from '../components/route/PrivateRoute'
import AdminRoute from '../components/route/AdminRoute'
// core
import HomePage from './core/HomePage'
import ProductSearchPage from './core/ProductSearchPage'
import StoreSearchPage from './core/StoreSearchPage'
import UserSearchPage from './core/UserSearchPage'
import CategoryPage from './core/CategoryPage'
import Policy from './core/Policy'
// admin
import AdminDashboardPage from './admin/DashboardPage'
import AdminLevelPage from './admin/LevelPage'
import AdminCommissionPage from './admin/CommissionPage'
import AdminUserPage from './admin/UserPage'
import AdminStorePage from './admin/StorePage'
import AdminCategoryPage from './admin/CategoryPage'
import AdminCreateCategoryPage from './admin/CreateCategoryPage'
import AdminEditCategoryPage from './admin/EditCategoryPage'
import AdminVariantPage from './admin/VariantPage'
import AdminCreateVariantPage from './admin/CreateVariantPage'
import AdminEditVariantPage from './admin/EditVariantPage'
import AdminVariantValuesPage from './admin/VariantValuePage'
import AdminBrandPage from './admin/BrandPage'
import AdminCreateBrandPage from './admin/CreateBrandPage'
import AdminEditBrandPage from './admin/EditBrandPage'
import AdminProductPage from './admin/ProductPage'
import AdminOrderPage from './admin/OrderPage'
import AdminOrderDetailPage from './admin/OrderDetailPage'
import AdminTransactionPage from './admin/TransactionPage'
import AdminReportPage from './admin/ReportPage'
import AdminReviewPage from './admin/ReviewPage'
// account
import AccountProfilePage from './account/ProfilePage'
import AccountAddressesPage from './account/AddressesPage'
import AccountOrderPage from './account/OrderPage'
import AccountFollowingPage from './account/FollowingPage'
import AccountWalletPage from './account/WalletPage'
import AccountStoreManagerPage from './account/StoreManagerPage'
import AccountCreateStorePage from './account/CreateStorePage'
import AccountVerifyEmailPage from './account/VerifyEmailPage'
import AccountChangePasswordPage from './account/ChangePasswordPage'
import AccountCartPage from './account/CartPage'
import AccountOrderDetailPage from './account/OrderDetailPage'
// seller
import SellerProfilePage from './seller/ProfilePage'
import SellerDashboardPage from './seller/DashboardPage'
import SellerProductsPage from './seller/ProductsPage'
import SellerOrderPage from './seller/OrderPage'
import SellerReturnPage from './seller/ReturnPage'
import SellerOrderDetailPage from './seller/OrderDetailPage'
import SellerStaffPage from './seller/StaffPage'
import SellerWalletPage from './seller/WalletPage'
import SellerReviewPage from './seller/ReviewPage'
import SellerCreateProductPage from './seller/CreateProductPage'
import SellerEditProductPage from './seller/EditProductPage'
// user
import UserHomePage from './user/UserHomePage'
import UserAboutPage from './user/UserAboutPage'
// store
import StoreHomePage from './store/HomePage'
import StoreAboutPage from './store/AboutPage'
import StoreCollectionPage from './store/CollectionPage'
import StoreReviewAndRatingPage from './store/ReviewAndRatingPage'
// product
import ProductDetailPage from './product/DetailPage'
import PageNotFound from '../components/ui/PageNotFound'
import ScrollToTops from '../hooks/ScrollToTops'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTops />
      <Routes>
        {/* core */}
        <Route path='/' element={<HomePage />} />
        <Route path='/products/search' element={<ProductSearchPage />} />
        <Route path='/stores/search' element={<StoreSearchPage />} />
        <Route path='/users/search' element={<UserSearchPage />} />
        <Route path='/category/:categoryId' element={<CategoryPage />} />
        <Route path='/legal/privacy' element={<Policy />} />

        {/* admin */}
        <Route
          path='/admin/dashboard'
          element={<AdminRoute element={<AdminDashboardPage />} />}
        />
        <Route
          path='/admin/level'
          element={<AdminRoute element={<AdminLevelPage />} />}
        />
        <Route
          path='/admin/commission'
          element={<AdminRoute element={<AdminCommissionPage />} />}
        />
        <Route
          path='/admin/report/:type?'
          element={<AdminRoute element={<AdminReportPage />} />}
        />
        <Route
          path='/admin/user'
          element={<AdminRoute element={<AdminUserPage />} />}
        />
        <Route
          path='/admin/store'
          element={<AdminRoute element={<AdminStorePage />} />}
        />
        <Route
          path='/admin/review'
          element={<AdminRoute element={<AdminReviewPage />} />}
        />
        <Route
          path='/admin/category'
          element={<AdminRoute element={<AdminCategoryPage />} />}
        />
        <Route
          path='/admin/category/create'
          element={<AdminRoute element={<AdminCreateCategoryPage />} />}
        />
        <Route
          path='/admin/category/edit/:categoryId'
          element={<AdminRoute element={<AdminEditCategoryPage />} />}
        />
        <Route
          path='/admin/variant'
          element={<AdminRoute element={<AdminVariantPage />} />}
        />
        <Route
          path='/admin/variant/create'
          element={<AdminRoute element={<AdminCreateVariantPage />} />}
        />
        <Route
          path='/admin/variant/edit/:variantId'
          element={<AdminRoute element={<AdminEditVariantPage />} />}
        />
        <Route
          path='/admin/variant/values/:variantId'
          element={<AdminRoute element={<AdminVariantValuesPage />} />}
        />
        <Route
          path='/admin/brand'
          element={<AdminRoute element={<AdminBrandPage />} />}
        />
        <Route
          path='/admin/brand/create'
          element={<AdminRoute element={<AdminCreateBrandPage />} />}
        />
        <Route
          path='/admin/brand/edit/:brandId'
          element={<AdminRoute element={<AdminEditBrandPage />} />}
        />
        <Route
          path='/admin/product'
          element={<AdminRoute element={<AdminProductPage />} />}
        />
        <Route
          path='/admin/order'
          element={<AdminRoute element={<AdminOrderPage />} />}
        />
        <Route
          path='/admin/order/detail/:orderId'
          element={<AdminRoute element={<AdminOrderDetailPage />} />}
        />
        <Route
          path='/admin/transaction'
          element={<AdminRoute element={<AdminTransactionPage />} />}
        />

        {/* account */}
        <Route
          path='/account/profile'
          element={<PrivateRoute element={<AccountProfilePage />} />}
        />
        <Route
          path='/account/addresses'
          element={<PrivateRoute element={<AccountAddressesPage />} />}
        />
        <Route
          path='/account/purchase'
          element={<PrivateRoute element={<AccountOrderPage />} />}
        />
        <Route
          path='/account/purchase/detail/:orderId'
          element={<PrivateRoute element={<AccountOrderDetailPage />} />}
        />
        <Route
          path='/account/following'
          element={<PrivateRoute element={<AccountFollowingPage />} />}
        />
        <Route
          path='/account/wallet'
          element={<PrivateRoute element={<AccountWalletPage />} />}
        />
        <Route
          path='/account/store'
          element={<PrivateRoute element={<AccountStoreManagerPage />} />}
        />
        <Route
          path='/account/store/create'
          element={<PrivateRoute element={<AccountCreateStorePage />} />}
        />
        <Route
          path='/cart'
          element={<PrivateRoute element={<AccountCartPage />} />}
        />
        <Route
          path='/verify/email/:emailCode'
          element={<AccountVerifyEmailPage />}
        />
        <Route
          path='/change/password/:passwordCode'
          element={<AccountChangePasswordPage />}
        />

        {/* seller */}
        <Route
          path='/seller/:storeId'
          element={<PrivateRoute element={<SellerDashboardPage />} />}
        />
        <Route
          path='/seller/profile/:storeId'
          element={<PrivateRoute element={<SellerProfilePage />} />}
        />
        <Route
          path='/seller/products/:storeId'
          element={<PrivateRoute element={<SellerProductsPage />} />}
        />
        <Route
          path='/seller/products/addNew/:storeId'
          element={<PrivateRoute element={<SellerCreateProductPage />} />}
        />
        <Route
          path='/seller/products/edit/:productId/:storeId'
          element={<PrivateRoute element={<SellerEditProductPage />} />}
        />
        <Route
          path='/seller/orders/:storeId/:status?'
          element={<PrivateRoute element={<SellerOrderPage />} />}
        />
        <Route
          path='/seller/return/:storeId'
          element={<PrivateRoute element={<SellerReturnPage />} />}
        />
        <Route
          path='/seller/orders/detail/:orderId/:storeId'
          element={<PrivateRoute element={<SellerOrderDetailPage />} />}
        />
        <Route
          path='/seller/staff/:storeId'
          element={<PrivateRoute element={<SellerStaffPage />} />}
        />
        <Route
          path='/seller/wallet/:storeId'
          element={<PrivateRoute element={<SellerWalletPage />} />}
        />
        <Route
          path='/seller/review/:storeId'
          element={<PrivateRoute element={<SellerReviewPage />} />}
        />

        {/* user */}
        <Route path='/user/:userId' element={<UserHomePage />} />
        <Route path='/user/about/:userId' element={<UserAboutPage />} />

        {/* store */}
        <Route path='/store/:storeId' element={<StoreHomePage />} />
        <Route
          path='/store/collection/:storeId'
          element={<StoreCollectionPage />}
        />
        <Route
          path='/store/rating/:storeId'
          element={<StoreReviewAndRatingPage />}
        />
        <Route path='/store/about/:storeId' element={<StoreAboutPage />} />

        {/* product */}
        <Route path='/product/:productId' element={<ProductDetailPage />} />

        {/* 404 */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

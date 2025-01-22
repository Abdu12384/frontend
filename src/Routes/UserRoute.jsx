import React from 'react'
import{Routes, Route} from 'react-router-dom'
import SignupPage from '../Pages/User/SignupPage'
import LoginPage from '../Pages/User/LoginPage'
import Home from '../Pages/User/HomePage'
import PageNotFound from '../Pages/PageNotFount/PageNotFount'
import ProductDetails from '../Components/ProductDetails'
import {ProtectedRoute,LoginProtectedRoute} from '../ProtectRoute/ProtectedRoute'
import CakePage from '../Pages/User/CakePage'
import UserDashboard from '../Pages/User/UserDashboard'
import UserDetailsForm from '../Components/UserComponents/AccountDetails'
import AddressPage from '../Pages/User/AddressPage'
import CartPage from '../Pages/User/CartPage'
import CheckoutPage from '../Pages/User/CheckoutPage'
import OrdersListPage from '../Components/UserComponents/OrderDetails'
import ForgotPassword from '../Components/ForgotPassword'
import ResetPassword from '../Components/ResetPassword'
import Wishlist from '../Pages/User/Wishlist'
import WalletPage from '../Pages/User/Wallet'
import OrderConfirmation from '../Components/OrderSuccess'
import OrderList from '../Pages/User/OrderInfo'
import PaymentError from '../Components/PaymentFailed'
import AboutPage from '../Pages/User/AboutPage'
import ContactPage from '../Pages/User/ContactPage'
function UserRoute() {
  return (
    <Routes>
       <Route element={<LoginProtectedRoute/>}>
            <Route path='signup' element={<SignupPage/>}/>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='forgot-pass' element={<ForgotPassword/>}/>
            <Route path='reset-password/:token' element={<ResetPassword/>}/>
            
       </Route>
            <Route path='home' element={<Home/>}/>
            <Route path='product-details/:id' element={<ProductDetails/>}/>

          <Route element={<ProtectedRoute/>}>
              <Route path='cakes' element={<CakePage/>}/> 
              <Route path='dashboard' element={<UserDashboard/>}/> 
              <Route path='account-details' element={<UserDetailsForm/>}/> 
              <Route path='Address' element={<AddressPage/>}/> 
              <Route path='cart' element={<CartPage/>}/> 
              <Route path='checkout' element={<CheckoutPage/>}/> 
              <Route path='orderdetails' element={<OrderList/>}/> 
              <Route path='wishlist' element={<Wishlist/>}/> 
              <Route path='wallet' element={<WalletPage/>}/> 
              <Route path='order-success' element={<OrderConfirmation/>}/> 
              <Route path='order-failed' element={<PaymentError/>}/> 
          </Route>

         <Route path='about' element={<AboutPage/>}/> 
         <Route path='contact' element={<ContactPage/>}/> 
         <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default UserRoute

import React from 'react'
import { Routes,Route } from 'react-router-dom'
import AdminLogin from '../Pages/Admin/AdminLoginPage'
import AdminLayout from '../Components/AdminComponents/AdminLayout'
import { AdminDashboard } from '../Pages/Admin/AdminDashboard'
import AdminProductsPage from '../Pages/Admin/AdminProductPage'
import { OrdersPage } from '../Components/AdminComponents/Orders'
import CustomerPanel from '../Pages/Admin/CustomerPanel'
import AdminCategory from '../Pages/Admin/AdminCategory'
import PageNotFound from '../Pages/PageNotFount/PageNotFount'
import CouponManagement from '../Pages/Admin/AdminCoupenPage'
import SaleReportPage from '../Pages/Admin/AdminSalesReport'
import {AdminProtectRouteLogin,AdminProtectRoute} from '../ProtectRoute/ProtectedRoute'

function AdminRoute() {
  return (
   <Routes>
         <Route element={<AdminProtectRouteLogin/>}>
           <Route path='login' element={<AdminLogin/>}/>
         </Route>

         <Route element={<AdminProtectRoute/>}>
               <Route path="/" element={<AdminLayout />} >
                <Route index element={<AdminDashboard />} />
                <Route path='dashboard' element={<AdminDashboard />} /> 
                <Route path="orders" element={<OrdersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="customers" element={<CustomerPanel />} />
                <Route path="category" element={<AdminCategory />} />
                <Route path="coupon" element={<CouponManagement />} />
                <Route path="sales-report" element={<SaleReportPage />} />
          </Route>
         </Route>


         <Route path="*" element={<PageNotFound />} />


   </Routes>
  )
}

export default AdminRoute

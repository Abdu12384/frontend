import axioInstence from "../utils/axioInstence";
import toast from "react-hot-toast";




const AddProductReq = async (productData)=>{
    try {
       const response = await axioInstence.post('/admin/add-product',productData)
        return response
    } catch (error) {
      console.log('Failed to add Product',error);
      throw error;

    }
}
const updatedProductReq = async (productId, updatedProductData)=>{
     try {
       const response = await axioInstence.put(`/admin/products/${productId}`,updatedProductData)
        return response.data
     } catch (error) {
      console.error("Error updating product:",error)
     }
}


export const fetchProducts = async (currentPage, productsPerPage, searchQuery, filterStatus) => {
   try {
       const response = await axioInstence.get('/admin/products', {
           params: {
               page: currentPage,
               limit: productsPerPage,
               search: searchQuery,
               status: filterStatus,
           },
       });
       return response.data; 
   } catch (error) {
       console.error('Error fetching products', error);
       throw error; 
   }
};



export const toggleProductStatus = async (productId, currentStatus) => {
   try {
       const response = await axioInstence.patch(`/admin/products/${productId}`, {
           isDeleted: !currentStatus,
       });
       return response.data; 
   } catch (error) {
       console.error('Error updating product status', error);
       throw error; 
   }
}


export const fetchCategories = async () => {
    try {
        const response = await axioInstence.get('/user/categories');
        return response.data; 
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error; 
    }
};


export const toggleCategoryBlockStatus = async (id, isDeleted) => {
    try {
        const response = await axioInstence.patch(`/admin/categories/block/${id}`, { isDeleted: !isDeleted });
        return response.data; 
    } catch (error) {
        console.error('Error toggling block status:', error);
        throw error; 
    }
};


export const fetchCoupons = async () => {
    try {
        const response = await axioInstence.get('/admin/coupons');
        return response.data; 
    } catch (error) {
        console.error('Error fetching coupons:', error);
        throw error; 
    }
};


export const deleteCoupon = async (couponId) => {
    try {
        const response = await axioInstence.delete(`/admin/delete-coupon/${couponId}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting coupon:', error);
        throw error; 
    }
};


export const fetchOrderDetails = async (timeFilter,  currentPage) => {
    try {
        const response = await axioInstence.get('/admin/sales-data', {
            params: {
                timeFilter,
                page: currentPage,
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error; 
    }
};



// USER 

export const fetchAddressDetails = async () => {
    try {
        const response = await axioInstence.get('/user/address-details');
        return response.data; 
    } catch (error) {
        console.error('Error fetching address details:', error);
        throw error; 
    }
};


export const deleteAddress = async (id) => {
    try {
        const response = await axioInstence.delete(`/user/delete-address/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error; 
    }
};


export const setDefaultAddress = async (id) => {
    try {
        const response = await axioInstence.put(`/user/set-default-address/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Error setting default address:', error);
        throw error; 
    }
};



export const fetchCartItems = async () => {
    try {
        const response = await axioInstence.get('/user/cart/item');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; 
    }
};


export const removeCartItem = async (productId, variantId) => {
    try {
        const response = await axioInstence.delete('/user/cart/remove', {
            data: {
                productId,
                variantId,
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error; 
    }
};


export const updateCartItemQuantity = async (productId, variantId, newQuantity) => {
    try {
        const response = await axioInstence.put('/user/cart/update', {
            productId,
            variantId,
            newQuantity,
        });
        return response.data; 
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error; 
    }
};


export const fetchWalletBalance = async () => {
    try {
        const response = await axioInstence.get('/user/wallet/balance');
        return response.data; 
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        throw error; 
    }
};

export const placeOrder = async (orderData) => {
    try {
        const response = await axioInstence.post('/user/place-order', orderData);
        return response.data; 
    } catch (error) {
        console.error('Error placing order:', error);
        throw error; 
    }
};


export const applyCoupon = async (couponCode, totalPrice) => {
    try {
        const response = await axioInstence.post('/user/apply-coupon', {
            code: couponCode,
            cartSummary: { totalPrice },
        });
        return response.data; 
    } catch (error) {
        console.error('Error applying coupon:', error);
        throw error; 
    }
};


export const deductFromWallet = async (orderDetails) => {
    try {
        const response = await axioInstence.post('/user/wallet/deduct', { orderDetails });
        return response.data; 
    } catch (error) {
        console.error('Error deducting from wallet:', error);
        throw error; 
    }
};


export const initiatePayment = async (amount) => {
    try {
        const response = await axioInstence.post('/user/order/payment', { amount });
        return response.data; 
    } catch (error) {
        console.error('Error initiating payment:', error);
        throw error; 
    }
};


export const verifyPayment = async (paymentData) => {
    try {
        const response = await axioInstence.post('/user/verify-payment', paymentData);
        return response.data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error; 
    }
};

export const verifyRepayment = async (paymentData) => {
    try {
        const response = await axioInstence.post('/user/verify-repayment', paymentData);
        return response.data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error; 
    }
};

export const PaymentFailed = async (paymentData) => {
    try {
        const response = await axioInstence.post('/user/handle-failed-payment', paymentData);
        return response.data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error; 
    }
};





export const fetchUserOrders = async () => {
    try {
        const response = await axioInstence.get('/user/orders');
        return response.data; 
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; 
    }
};


export const fetchUserOrderDetails = async (orderId) => {
    try {
        const response = await axioInstence.get(`/user/order-details/${orderId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error; 
    }
};


export const cancelOrder = async (orderId,reason) => {
    try {
        const response = await axioInstence.post(`/user/cancel-order/${orderId}`,{
            reason
        });
        return response.data; 
    } catch (error) {
        console.error('Error canceling order:', error);
        throw error; 
    }
};



export const cancelProduct = async (orderId, productId) => {
    try {
        const response = await axioInstence.post('/user/cancel-product', {
            orderId,
            productId,
        });
        return response.data; 
    } catch (error) {
        console.error('Error canceling product:', error);
        throw error; 
    }
};


export const requestReturn = async (orderId, productId, variantId, reason) => {
    try {
        const response = await axioInstence.post('/user/return-request', {
            orderId,
            productId,
            variantId,
            reason,
        });
        return response.data; 
    } catch (error) {
        console.error('Error requesting return:', error);
        throw error; 
    }
};

export const fetchWalletInfo = async () => {
    try {
        const response = await axioInstence.get('/user/wallet/balance');
        return response.data; 
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        throw error; 
    }
};


export const addMoneyToWallet = async (amount) => {
    try {
        const response = await axioInstence.post('/user/wallet/add-money', { amount });
        return response.data; 
    } catch (error) {
        console.error('Error adding money to wallet:', error);
        throw error; 
    }
};




export const fetchFilterProducts = async (sortOption, selectedOccasion, selectedCategory, currentPage, productsPerPage) => {
    try {
      const params = new URLSearchParams();
      params.append('sort', sortOption);
      params.append('type', selectedOccasion);
      params.append('category', selectedCategory);
      params.append('page', currentPage);
      params.append('limit', productsPerPage);
  
      const response = await axioInstence.get(`/user/products-list?${params.toString()}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; 
    }
  };














export {
   AddProductReq,
   updatedProductReq 
}
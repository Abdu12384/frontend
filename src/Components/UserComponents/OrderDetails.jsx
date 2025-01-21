import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin,ArrowLeft } from 'lucide-react';
import axioInstance from '../../utils/axioInstence';
import OrderTrackingUI from './TrackingOrder';
import toast, { Toaster } from "react-hot-toast";
import NavBar from '../Navbar';
import { format } from 'date-fns';
import { fetchUserOrders ,cancelOrder, cancelProduct, requestReturn, initiatePayment, verifyPayment, verifyRepayment } from '../../services/authService';
import ConfirmationPopup from '../ConformButton';

const OrdersListPage = ({orderId, onBack }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [showReturnOptions, setShowReturnOptions] = useState(false);
  const [returnReason, setReturnReason] = useState({});
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedVariants, setSelectedVariants] = useState('')
  const [showCancelOrderConfirmation, setShowCancelOrderConfirmation] = useState(false);
  const [showCancelProductConfirmation, setShowCancelProductConfirmation] = useState(false);
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [productToCancel, setProductToCancel] = useState(null);
  const [productToReturn, setProductToReturn] = useState(null);

  





  
  useEffect(()=>{
    
      const fetchOrderDetails = async () => {
        try {
          const response = await axioInstance.get(`/user/order-details/${orderId}`);
          setSelectedOrder(response.data);
          console.log('detais',response.data);
          
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('Failed to fetch order details');
        }
      };
      fetchOrderDetails()

  },[orderId])


  console.log('seleected order',selectedOrder);
  


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };



 


 const handleCancelOrderClick = (event, orderId) => {
    event.preventDefault();
    setOrderToCancel(orderId);
    setShowCancelOrderConfirmation(true);
  };



  const handleCancelOrder = async (cancelReason) => {
    try {

      if (!cancelReason) {
        toast.error("Please provide a cancellation reason.");
        return;
    }
        const response = await cancelOrder(orderToCancel,cancelReason); 
        toast.success(response.message);

        setOrders((prevOrders) =>
            prevOrders.map(order =>
                order._id === orderToCancel ? { ...order, status: 'cancelled' } : order
            )
        );
        setSelectedOrder(null);
    } catch (error) {
        console.error('Error canceling order:', error);
        // toast.error(error.response?.data?.message);

    }
};




const handleCancelProductClick = (productId) => {
  setProductToCancel(productId);
  setShowCancelProductConfirmation(true);
};

const handleCancelProduct = async () => {
  try {
      const response = await cancelProduct(selectedOrder._id, productToCancel); 

      if (response.success) {
          toast.success(response.message);
      } else {
          toast.error(response.message || 'Failed to cancel product');
      }
  } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
  }
};



  const handleReasonChange = (productId, value) => {
    setReturnReason((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };





  const handleReturnClick = (productId,) => {
    setProductToReturn(productId);
    setShowReturnConfirmation(true);
  };

  const handleConformReturn = async (productId) => {
    const reason = returnReason[productId];
   
    try {
        const response = await requestReturn(selectedOrder._id, productToReturn,selectedVariants, reason); 
        console.log('Return request response:', response);

        if (response) {
            toast.success(response.message);
            setShowReturnOptions(false);
            setSelectedProduct(null);
            setReturnReason({}); 
        }
    } catch (error) {
        console.error('Return request error:', error);
        toast.error(error.response?.data?.message || 'Failed to request return');
    }
};


   const statusColors = {
    pending: "text-yellow-500",
    completed: "text-green-500",
    failed: "text-red-500",
    refunded: "text-blue-500"
  };



  const handleDownloadInvoice = async (orderId) => {

     try {
       const response = await axioInstance.get(`/user/order-invoice/${orderId}`,{
         responseType:'blob'
       })

       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `Invoice_${orderId}.pdf`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);

     } catch (error) {
       console.error('Error downloading invoice:', error); 
        toast.error('Failed to download invoice. Please try again later.')
     }
  }




  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };







  const handleRepayment = async (orderId) => {
    try {


        const totalPrice = selectedOrder.totalPrice; 

        const paymentResponse = await initiatePayment(totalPrice); 
        const { id, amount, currency, key_id } = paymentResponse;

        console.log('Backend Response:', paymentResponse);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error('Payment Initialization Error: Razorpay library not loaded');
            return;
        }

        const options = {
            key: key_id,
            amount: amount,
            currency: currency,
            name: 'KBS Bakes',
            description: 'Repayment for Order',
            order_id: id,
            handler: async function (response) {
                const paymentData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId:selectedOrder._id , 
                };

                try {
                    const verifyResponse = await verifyRepayment(paymentData); 
                    console.log('Verify Response:', verifyResponse);
                    
                    if (verifyResponse.success) {
                        toast.success(verifyResponse.message);
                        setTimeout(() => {
                            // setLoading(true);
                            setTimeout(() => {
                                // setLoading(false);
                                navigate('/user/order-success');
                            }, 2000);
                        }, 1000);
                    } else {
                        toast.error(verifyResponse.message || 'Payment verification failed');
                    }
                } catch (error) {
                    toast.error('Payment Verification Error');
                    console.error('Verification Error:', error);
                }
            },
            prefill: {
                name: selectedOrder.shippingAddressId.fullName,
                email: selectedOrder.shippingAddressId.email || '',
                contact: selectedOrder.shippingAddressId.mobile,
            },
            theme: {
                color: '#6C63FF',
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', async function (response) {
            console.error('Payment Failed:', response.error);
            try {
                rzp.close();
                console.log('Razorpay modal closed');
            } catch (closeError) {
                console.error('Error closing Razorpay modal:', closeError);
            }

            const failedPaymentData = {
                orderDetails: orderDetails,
                paymentFailure: {
                    reason: response.error.reason,
                    description: response.error.description,
                    order_id: response.error.metadata.order_id,
                    payment_id: response.error.metadata.payment_id,
                }
            };

            try {
                const failureResponse = await PaymentFailed(failedPaymentData); 
                console.log('Failure Response:', failureResponse);
                
                if (failureResponse.success) {
                    toast.success(failureResponse.message);
                } else {
                    toast.error(failureResponse.message || 'Failed to create order for failed payment.');
                }
            } catch (error) {
                toast.error('Error handling failed payment.');
                console.error('Failed Payment Error:', error);
            }
        });

        rzp.open();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Payment Initialization Error');
        console.error('Payment Initialization Error:', error);
    }
};




  
return (
  <>
    <NavBar />
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {selectedOrder && (
            <>
              <div className="lg:col-span-2 ">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row justify-between mb-6">
                  <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>Back</span>
                      </button>

                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
                      <p className="text-sm text-gray-600">Order #{selectedOrder._id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        Order Date: {format(new Date(selectedOrder.orderDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right mt-4 lg:mt-0">
                      <p className="text-2xl font-bold text-gray-900">₹{selectedOrder.totalPrice.toFixed(2)}</p>
                      <span className={`font-bold text-lg ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  <OrderTrackingUI orders={selectedOrder} />
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Products</h3>
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-4 mb-4 lg:mb-0">
                          <img
                            src={product.productId?.images[0] || "/placeholder.svg"}
                            alt={product.productId?.productName}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.productId?.productName}</p>
                            <p className="text-sm text-gray-600">Quantity: {product?.quantity}</p>
                            {product.returnRequest && (
                              <p
                                className={`text-sm font-medium ${
                                  product.returnRequest.status === 'approved'
                                    ? 'text-green-600'
                                    : product.returnRequest.status === 'pending'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                              >
                                Return {product.returnRequest.status}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p>Payment Status</p>
                          <p className={`${statusColors[product?.paymentStatus] || 'text-gray-500'} font-bold`}>
                            {product?.paymentStatus}
                          </p>
                          {selectedOrder.status.toLowerCase() === 'delivered' &&
                            !product.isCanceled &&
                            (!product.returnRequest || product.returnRequest.status !== 'approved') && (
                              <span className="text-green-500 font-bold text-lg font-semibold">delivered</span>
                            )}
                          {product.returnRequest && product.returnRequest.status === 'approved' && (
                            <p className="text-sm text-green-600">Amount Refunded</p>
                          )}
                          {product.isCanceled ? (
                            <span className="text-red-500 font-semibold font-bold text-lg">Canceled</span>
                          ) : (
                            selectedOrder.status.toLowerCase() !== 'delivered' && (
                              <button
                                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                                onClick={() => handleCancelProductClick(product.productId._id)}
                              >
                                Cancel
                              </button>
                            )
                          )}
                          {selectedOrder.status.toLowerCase() === 'delivered' &&
                            !product.isCanceled &&
                            (!product.returnRequest || product.returnRequest.status !== 'approved') && (
                              <button
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                                onClick={() => {
                                  setShowReturnOptions(true);
                                  setSelectedProduct(product.productId._id);
                                  setSelectedVariants(product.variantId)
                                }}
                              >
                                Return
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Shipping Address</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="font-medium text-lg text-gray-900">
                            {selectedOrder?.shippingAddressId?.fullName}
                          </p>
                        </div>
                        <div className="pl-10 text-gray-600 space-y-2">
                          <p className="text-sm">{selectedOrder?.shippingAddressId?.address}</p>
                          <p className="text-sm">
                            {selectedOrder?.shippingAddressId?.city}, {selectedOrder?.shippingAddressId?.state}{' '}
                            {selectedOrder?.shippingAddressId?.postalCode}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Phone:</span> {selectedOrder?.shippingAddressId?.mobile}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Order Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-gray-600">
                          <p className="font-medium">Payment Method</p>
                          <p className="font-medium">₹{selectedOrder?.paymentInfo}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <p className="font-medium">Subtotal</p>
                          <p className="font-medium">₹{selectedOrder?.subtotal?.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <p className="font-medium">Discount</p>
                          <p
                            className={`font-medium ${
                              selectedOrder.discount ? 'text-green-500' : 'text-gray-600'
                            }`}
                          >
                            ₹{selectedOrder.discount ? selectedOrder?.discount?.toFixed(2) : 0}
                          </p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <p className="font-medium">Shipping</p>
                          <p className="font-medium">₹{selectedOrder?.shippingCost?.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <p className="font-medium">GST ({selectedOrder?.gstRate}%)</p>
                          <p className="font-medium">₹{selectedOrder?.gstAmount?.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-4">
                          <p>Total</p>
                          <p>₹{selectedOrder.totalPrice.toFixed(2)}</p>
                        </div>
                        {selectedOrder && (
                          <div className="order-status">
                            {selectedOrder.status.toLowerCase() === 'cancelled' ? (
                              <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                                role="alert"
                              >
                                <strong className="font-bold">Order Canceled!</strong>
                                <span className="block sm:inline">
                                  {' '}
                                  This order has been canceled successfully.
                                </span>
                              </div>
                            ) : (
                              selectedOrder.status.toLowerCase() !== 'delivered' &&
                              selectedOrder.products.some((product) => !product.isCanceled) && (
                                <button
                                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                                  onClick={(event) => handleCancelOrderClick(event, selectedOrder._id)}
                                >
                                  Cancel Order
                                </button>
                              )
                            )}
                          </div>
                        )}
                        <div className="text-right">
                          {selectedOrder.status.toLowerCase() === 'delivered' &&
                            selectedOrder?.products?.every(
                              (product) => product?.paymentStatus?.toLowerCase() === 'completed'
                            ) && (
                              <button
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                                onClick={() => handleDownloadInvoice(selectedOrder._id)}
                              >
                                Download Invoice
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {showReturnOptions && selectedOrder.status.toLowerCase() === 'delivered' && (
                    <div className="mt-4 border rounded p-4">
                      <textarea
                        className="w-full border rounded p-2"
                        placeholder="Enter the reason for return..."
                        value={returnReason[selectedProduct] || ''}
                        onChange={(e) => handleReasonChange(selectedProduct, e.target.value)}
                      ></textarea>
                      <button
                        className="mt-2 mr-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                        onClick={() => handleReturnClick(selectedProduct,selectedVariants)}
                      >
                        Confirm Return
                      </button>
                      <button
                        className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                        onClick={() => {
                          setShowReturnOptions(false);
                          setSelectedProduct(null);
                          setReturnReason({});
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  

                  {selectedOrder && (
                    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          <span className="font-medium">Order ID:</span> {selectedOrder?._id}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Total Amount:</span> ₹
                          {selectedOrder?.totalPrice?.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Payment Status:</span>
                          <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedOrder?.paymentStatus?.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : selectedOrder?.paymentStatus?.toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : selectedOrder?.paymentStatus?.toLowerCase() === 'refunded'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedOrder?.paymentStatus?.toLowerCase() === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800' // Default for unknown statuses
                            }`}>
                              {selectedOrder?.paymentStatus}
                            </span>
                        </p>
                      </div>
                      {selectedOrder?.paymentStatus?.toLowerCase() === 'pending' &&
                        selectedOrder.status.toLowerCase() !== 'cancelled' && (
                          <div className="mt-6">
                            <button
                              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                              onClick={() => handleRepayment(selectedOrder?._id)}
                            >
                              Repay Now
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1">
                {/* You can add a sidebar or additional information here */}
              </div>
            </>
          )}
        </div>
      </div>
      {showCancelOrderConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to cancel this order?"
          cancelOrder={showCancelOrderConfirmation}
          onConfirm={(updatedReason) => {
            handleCancelOrder(updatedReason);
            setShowCancelOrderConfirmation(false);
          }}
          onCancel={() => {
            setShowCancelOrderConfirmation(false);
            setOrderToCancel(null);
          }}
        />
      )}

      {showCancelProductConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to cancel this product?"
          onConfirm={() => {
            handleCancelProduct();
            setShowCancelProductConfirmation(false);
          }}
          onCancel={() => {
            setShowCancelProductConfirmation(false);
            setProductToCancel(null);
          }}
        />
      )}

      {showReturnConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to return this product?"
          onConfirm={() => {
            handleConformReturn(productToReturn);
            setShowReturnConfirmation(false);
          }}
          onCancel={() => {
            setShowReturnConfirmation(false);
            setProductToReturn(null);
            setReturnReason({});
          }}
        />
      )}
    </div>
  </>
);

};

export default OrdersListPage;




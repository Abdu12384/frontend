import React, { useEffect, useState } from 'react';
import { ShoppingCart, MoreVertical, Calendar, User,X, CreditCard, Package, RefreshCw, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import axioInstence from '../../utils/axioInstence';
import Pagination from '../Pagination';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationPopup from '../ConformButton';
// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 mr-1" />;
      case 'shipped':
        return <Package className="w-4 h-4 mr-1" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusStyles()}`}>
      {getStatusIcon()}
      {status}
    </span>
  );
};




export function OrdersPage() {


  const [orders, setOrders] = useState([])
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
  const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [showStatusChangeConfirmation, setShowStatusChangeConfirmation] = useState(false);
  const [totalPages, setTotalPages]= useState(1)
  const [newStatus, setNewStatus] = useState('');

  const ordersPerPage = 5;

  const fetchOrderDetails = async(page = 1) =>{
     try {

      const response = await axioInstence.get(`/admin/orders/manage?page=${page}&${ordersPerPage}`)
      console.log(response);
      
      const transformedOrders = response.data.orders.map(order => ({
        ...order,
        products: order.products.map(product => ({
          ...product,
          returnRequest: product.returnRequest ? {
            reason: product.returnRequest.reason,
            status: product.returnRequest.status,
            requestDate: product.returnRequest.requestDate,
            _id: product.returnRequest._id
          } : null
        }))
      }));
      setOrders(transformedOrders);
      setTotalPages(response.data.totalOrders)
     } catch (error) {
       console.log(error?.response?.data?.message)
     }
  }



  useEffect(() => {
    fetchOrderDetails(currentPage);
  }, [currentPage]);
  

  const openReturnRequestPopup = (order, product) => {
    setSelectedReturnRequest({ order, product });
    setIsReturnPopupOpen(true);
  };




  const renderReturnRequest = (order,product) => {
    if (!product.returnRequest) return null;

    const getReturnStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'processing': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="mt-2 bg-gray-50 p-3 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReturnStatusColor(product.returnRequest.status)}`}>
            {product.returnRequest.status}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(product.returnRequest.requestDate).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-2">{product.returnRequest.reason}</p>
        <button
          onClick={() => openReturnRequestPopup(order, product)}
          className="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Manage Return
        </button>
      </div>
    );
  };
  
  useEffect(()=>{
    fetchOrderDetails()
  },[])
  
  const openPopup = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };
  
  const closePopup = () => {
    setSelectedOrder(null);
    setIsPopupOpen(false);
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  

  
  const handleCancelOrder = async (orderId) =>{
    try {
      const response = await axioInstence.patch(`/admin/orders/cancel/${orderId}`)
      //  toast.success(response.data.message)
      if(response.status===200){
        setOrders((preveOrders) =>
          preveOrders.map((order) =>
            order._id === orderId ? {...order, status: 'cancelled'} : order
      )
    )
    
  }
} catch (error) {
  console.error('Error cancelling order:', error.response?.data?.message || error.message);
  toast.error(error.response.data.message)
  setIsPopupOpen(false)
  
  }
 }




  const openStatusChangeConfirmation = (status) => {
    setNewStatus(status);
    setShowStatusChangeConfirmation(true);
  };

  const handleStatusChange = async () =>{
     try {
       const response = await axioInstence.patch(`/admin/orders/status/${selectedOrder._id}`,{status: newStatus})
        console.log('status',response);
        
       if(response.status === 200){
        
        setOrders((prevOrders)=>
        prevOrders.map((order) =>
         order._id === selectedOrder._id ? { ...order, status: newStatus} : order
        ) )
       }
       toast.success(response.data.message)
       setIsPopupOpen(false)
     } catch (error) {
      console.error('Error updating order status:', error.response?.data?.message );
      toast.error(error.response.data.message)
      setIsPopupOpen(false)
     }
  }


  const handleReturnRequestUpdate = async (orderId, productId, newStatus) => {
    try {
      const response = await axioInstence.patch(`/admin/return-request/${orderId}/${productId}`, {
        status: newStatus
      });
      
      if (response.status === 200) {
        setOrders(prevOrders => 
          prevOrders.map(order => {
            if (order._id === orderId) {
              return {
                ...order,
                products: order.products.map(product => {
                  if (product._id === productId) {
                    return {
                      ...product,
                      returnRequest: {
                        ...product.returnRequest,
                        status: newStatus
                      }
                    };
                  }
                  return product;
                })
              };
            }
            return order;
          })
        );
        setIsReturnPopupOpen(false);
      }
      toast.success(response.data.message)

    } catch (error) {
      console.error('Error updating return request:', error.response?.data?.message || error.message);
      toast.error(error.response.data.message)

    }
  };
  
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  console.log('orde',orders);
  
  
  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}>
    <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"></div>
      
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="text-white w-full space-y-6 mt-16 lg:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center">
                <ShoppingCart className="w-8 h-8 mr-2" />
                Orders Dashboard
              </h2>
              <div className="bg-purple-600 text-white rounded-full p-2">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Orders', value: '100', icon: <ShoppingCart className="w-6 h-6" /> },
                { label: 'Completed', value: '85', icon: <CheckCircle className="w-6 h-6" /> },
                { label: 'Processing', value: '10', icon: <Clock className="w-6 h-6" /> },
                { label: 'Cancelled', value: '5', icon: <XCircle className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 flex items-center">
                  <div className="bg-purple-600 rounded-full p-2 mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 md:p-6">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left border-b border-white border-opacity-20">
                  <th className="pb-4 px-4">Order ID</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Customer</th>
                  <th className="pb-4 px-4">Total</th>
                  <th className="pb-4 px-4">Payment</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                    key={order._id}
                    className={`border-b border-white border-opacity-10 
                      hover:bg-white hover:bg-opacity-5 transition-colors duration-200
                      ${order?.products?.some(
                        product => product?.returnRequest?.status && product.returnRequest.status !== 'approved'
                      ) ? 'bg-yellow-400' : ''}`}                     
                      onClick={() => toggleOrderDetails(order._id)}
                  >
                 
                       <td className="py-4 px-4">
                      <span className="text-blue-400 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        #{order._id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.orderDate).toLocaleDateString()} {/* Formatting the date */}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {order.userId?.fullName || "Unknown Customer"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      ₹{order.totalPrice.toLocaleString()} {/* Formatting total price */}
                    </td>
                    <td className="py-2 px-2">
                      <span className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {order.paymentInfo || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                        <StatusBadge status={order.status} />
                      </td>
                    <td className="py-5 px-5">
                    <button
                            className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
                            aria-label="More options"
                            onClick={() => openPopup(order)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                    </td>                 
                  </tr>
                  {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan="8" className="p-4 bg-white bg-opacity-5">
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Order Details</h3>

                            {/* Shipping Address */}
                            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

                            {order.status === "cancelled" && order.cancelReason && ( // <-! Check if order is cancelled and reason exists
                                <p className="text-red-500 font-medium">
                                  <strong>Cancellation Reason:</strong> <p className='text-red-100'>{order.cancelReason}</p>
                                </p>
                              )}


                            {/* Product Information Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-300 text-left">
                                    <th className="py-2 px-4">Image</th>
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Price</th>
                                    <th className="py-2 px-4">Discount</th>
                                    <th className="py-2 px-4">Quantity</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.products.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-200">
                                      <td className="py-4 px-4">
                                        <img
                                          src={product.productId?.images[0]}
                                          alt={product.productId?.productName || "Product Image"}
                                          className="w-16 h-16 object-cover rounded-lg"
                                        />
                                      </td>

                                      <td className="py-4 px-4">
                                        {product.productId?.productName || "Unknown Product"}
                                      </td>

                                      <td className="py-4 px-4">
                                        ₹{product.price.toLocaleString()}
                                      </td>

                                      <td className="py-4 px-4">
                                        {product.discount ? `${product.discount}%` : "N/A"}
                                      </td>

                                      <td className="py-4 px-4">
                                        {product.quantity}
                                      </td>
                                      <td className="py-4 px-4">
                                        {product.isCanceled ? (
                                          <p className="text-red-400 font-bold text-lg">Cancelled</p>
                                        ) : order.status === "delivered" ? (
                                          <p className="text-green-400 font-bold text-lg">Delivered</p>
                                        ) : (
                                          <p className="text-yellow-400 font-bold text-lg">In Progress</p>
                                        )}
                                      </td>


                                      <td className="py-4 px-4">
                                        <div>
                                          {renderReturnRequest(order, product)}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Total Price */}
                            <p className="font-semibold text-lg">
                              <strong>Total:</strong> ₹{order.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}

                  </>
                ))}
                
              </tbody>
            </table>
              </div>
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Actions</h3>
              <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Order ID: #{selectedOrder._id.slice(0, 8)}</p>
                <p>Current Status: <StatusBadge status={selectedOrder.status} /></p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Change Status:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'shipped', 'delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => openStatusChangeConfirmation(status)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={()=>handleCancelOrder(selectedOrder._id)}
                className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
          {showStatusChangeConfirmation && (
                <ConfirmationPopup
                  message={`Are you sure you want to update the status to '${newStatus}'?`}
                  onConfirm={() => {
                    handleStatusChange();
                    setShowStatusChangeConfirmation(false);
                  }}
                  onCancel={() => {
                    setShowStatusChangeConfirmation(false);
                    newStatus(null);
                  }}
                />
            )}
        </div>
      )}
       {isReturnPopupOpen && selectedReturnRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Return Request</h3>
              <button 
                onClick={() => setIsReturnPopupOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Order ID: #{selectedReturnRequest.order._id.slice(0, 8)}</p>
                <p className="font-medium">Product: {selectedReturnRequest.product.productId.productName}</p>
                <p className="text-sm mt-2">Return Reason: {selectedReturnRequest.product.returnRequest.reason}</p>
                <p className="text-sm">Current Status: {selectedReturnRequest.product.returnRequest.status}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Update Return Status:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleReturnRequestUpdate(
                        selectedReturnRequest.order._id,
                        selectedReturnRequest.product._id,
                        status
                      )}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


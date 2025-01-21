import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchUserOrders } from '../../services/authService';
import { ChevronRight } from 'lucide-react';
import OrdersListPage from '../../Components/UserComponents/OrderDetails';
import NavBar from '../../Components/Navbar';
import { BreadcrumbUserDhbrd } from '../../Components/BrudCrums';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);




    const getGridClass = (productCount) => {
      switch (Math.min(productCount, 4)) {
        case 1: return 'grid-cols-1 grid-rows-1';
        case 2: return 'grid-cols-2 grid-rows-1';
        case 3: return 'grid-cols-2 grid-rows-2';
        case 4: return 'grid-cols-2 grid-rows-2';
        default: return 'grid-cols-2 grid-rows-2';
      }
    };
 

    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'processing':
          return 'bg-blue-100 text-blue-800';
        case 'shipped':
          return 'bg-purple-100 text-purple-800';
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            // setIsLoading(true);
            const data = await fetchUserOrders(); 
            
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
              console.log('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);

        } 
    };

    fetchOrders();
}, []);

console.log(orders);

const onSelectOrder = (orderId) => {
  setSelectedOrderId(orderId); 
};

const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/user/dashboard' },
  { label: 'orderdetails', url: null }, 
];

if (selectedOrderId) {
  return <OrdersListPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
}

  return (
     <>
      <NavBar/>
    <div className="p-4 space-y-6">
      <BreadcrumbUserDhbrd items={breadcrumbItems}/>
    {orders?.map((order) => (
      <div 
        key={order?._id} 
        className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onSelectOrder(order?._id)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-xl">Order #{order?._id?.slice(0,8)}</h2>
            <p className="text-sm text-gray-600">
              {format(new Date(order.orderDate), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-semibold text-xl">₹{order?.totalPrice?.toFixed(2)}</p>
              <span className={`text-sm font-medium px-4 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>

        <div className="w-full max-w-[300px]">
          <div className="aspect-square w-full">
            <div className={`grid ${getGridClass(order?.products?.length)} gap-0.5 h-full bg-gray-100 rounded-lg overflow-hidden`}>
              {order?.products?.slice(0, 4).map((product, index) => (
                <div 
                  key={index} 
                  className="relative w-full h-full bg-white"
                >
                  <img
                    src={product?.productId?.images[0] || "/placeholder.svg"}
                    alt={product?.productId?.productName}
                    className="h-full w-full object-cover"
                  />
                  {order?.products.length > 4 && index === 3 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="text-white font-semibold text-sm">
                        +{order.products.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium">{order?.products[0]?.productId?.productName || 'Product Name'}</p>
            <p className="text-sm text-gray-600">
              {order?.products?.length === 1 
                ? `Qty: ${order.products[0]?.quantity || 1}`
                : `${order.products.length} products`
              }
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
  </>
  );
};

export default OrderList;
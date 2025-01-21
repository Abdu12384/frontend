
import React, { useState, useEffect } from 'react';
import { ClipboardList, Package, Truck, Home, Check } from 'lucide-react';



const OrderTrackingUI = ({ orders }) => {


    const [order, setOrder] = useState(orders);
    console.log(order);
    
    useEffect(() => {
      setOrder(orders);
    }, [orders]);
    

  const stages = [
    { id: 'pending', label: 'Order\nProcessed', icon: ClipboardList },
    { id: 'shipped', label: 'Order\nShipped', icon: Package },
    { id: 'en-route', label: 'Order\nEn Route', icon: Truck },
    { id: 'delivered', label: 'Order\nArrived', icon: Home }
  ];

  console.log('order hresir',order);
  
  const getStageStatus = (stageId) => {
    const stageOrder = stages.findIndex(stage => stage.id === stageId);
    const currentStageOrder = stages.findIndex(stage => stage.id === order.status.toLowerCase());
    return stageOrder <= currentStageOrder;
  };

  
  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-6">
    <div className="flex flex-col md:flex-row justify-between mb-12">
      <div className="space-y-1">
        <p className="text-gray-400 text-sm">INVOICE</p>
        <p className="text-white text-xl md:text-2xl font-semibold">#{order._id}</p>
      </div>
      <div className="text-right space-y-1">
        <p className="text-white text-lg">Expected Arrival: {order.expectedArrival || '01/12/19'}</p>
        <p className="text-gray-400 text-sm">{order.trackingNumber || 'USPS 234094567242423422898'}</p>
      </div>
    </div>

      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
          <div 
            className="h-full bg-violet-500 transition-all duration-500"
            style={{
              width: `${(stages.findIndex(stage => stage.id === order.status.toLowerCase()) + 1) * 25}%`
            }}
          />
        </div>

        <div className="relative grid grid-cols-4 gap-2">
          {stages.map((stage) => {
            const isCompleted = getStageStatus(stage.id);
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
                    isCompleted ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <StageIcon className="w-5 h-5" />}
                </div>
                <p className="text-sm font-medium text-center text-white whitespace-pre-line">
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingUI



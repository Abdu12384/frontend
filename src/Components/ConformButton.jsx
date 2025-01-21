import React from 'react';
import { useState } from 'react';

const   ConfirmationPopup = ({ message,cancelOrder, onConfirm, onCancel, }) => {

  const [reason, setReason] = useState(''); 


  const handleReasonChange = (e) => {
    setReason(e.target.value); 
  };

  const handleConfirm = () => {
    onConfirm(reason); 
  };

  

  return (

      <div className="fixed inset-0 bg-black bg-opacity-50  z-50 flex items-center justify-center">

        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
          <p className="mb-6">{message}</p>
          
          {cancelOrder &&
            <textarea
            value={reason}
            onChange={handleReasonChange}
            placeholder="Please provide a reason for cancellation"
            className="w-full p-2 border rounded mb-4"
          ></textarea>
          }

          <div className="flex justify-end space-x-4">
            <button 
             onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
              Cancel
            </button>
            <button 
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Confirm
            </button>
          </div>
        </div>
      </div>
  );
};

export default ConfirmationPopup;


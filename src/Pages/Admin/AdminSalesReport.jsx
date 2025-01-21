import React, { useEffect, useState } from 'react';
import { Search, Download, Edit, FileSpreadsheet, Trash, ChevronDown, DollarSign, ShoppingCart, Package, BarChart2, ChevronLeft,IndianRupee, ChevronRight } from 'lucide-react';
import axioInstence from '../../utils/axioInstence';
import Pagination from '../../Components/Pagination';
import { fetchOrderDetails } from '../../services/authService';

const SaleReportPage = () => {
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [stats, setStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy]= useState('orderDate')
  const [sortOrder, setSortOrder] = useState(-1);
  const [orderData, setOrderData]= useState([])
  const [totalPages, setTotalPages] = useState(1);

  
  

  
  useEffect(() => {
    const loadOrderDetails = async () => {
        try {
            const data = await fetchOrderDetails(timeFilter, currentPage);
            console.log('Fetched order details', data);
            setOrderData(data.orders); 
            setTotalPages(data.pagination.pages); 
            updateStatus(data.OrderSummury)
           
                } catch (error) {
            console.error('Error loading order details', error);
        }
    };
    
    loadOrderDetails();
  }, [timeFilter, currentPage]);
  
  
  function updateStatus(data){
    const overallSalesCount = data.totalOrders;
    const overallOrderAmount = data.totalRevenue
    const overallDiscount = data.totalDiscount

    setStats([
      { title: 'Overall Sales Count', value: `${overallSalesCount}`, icon: BarChart2, color: 'green' },
      { title: 'Overall Order Amount', value: `₹${overallOrderAmount.toFixed(2)}`, icon: IndianRupee, color: 'yellow' },
      { title: 'Overall Discount', value: `₹${overallDiscount.toFixed(2)}`, icon: ShoppingCart, color: 'pink' },
    ]);
  }


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const exportToPDF = async () => {
    try {
      const response = await axioInstence.get('/admin/generate-pdf', {
        params: {
          timeFilter,
          sortBy,
          sortOrder
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-report.pdf';
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };


  const exportToExcel = async () => {
    try {
      const response = await axioInstence.get('/admin/generate-excel', {
        params: {
          timeFilter,
          sortBy,
          sortOrder
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-report.xlsx';
      link.click();
    } catch (error) {
      console.error('Excel export failed:', error);
    }
  };
  



  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by All"
            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row  items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <select 
            className="appearance-none bg-white  border rounded-lg pl-4 pr-10 py-2 w-full sm:w-auto"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>All Time</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <ChevronDown className="absolute  right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <button 
        onClick={exportToPDF}
        className="flex items-center  gap-2 bg-black text-white px-4 py-2 rounded-lg w-full sm:w-auto justify-end">
          <Download className="h-5 w-5" />
          Export
        </button>
        <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg flex-1 sm:flex-initial justify-center"
            >
              <FileSpreadsheet className="h-5 w-5" />
              Export Excel
           </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total QTY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order._id.slice(0, 8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.products[0]?.productId?.productName }</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.products[0]?.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.userId?.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Done' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.discount ? order?.discount?.toLocaleString() : 'No Discount'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">₹{order.totalPrice.toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SaleReportPage;


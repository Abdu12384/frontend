import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, DollarSign, ShoppingBag, TrendingUp, Package, Archive, BookOpen } from 'lucide-react';
import axioInstence from '../../utils/axioInstence';



export const AdminDashboard = () => {
  
  const [bestSellingProducts, setBestSellingProducts]= useState([])
  const [topCategories, setTopCategories] = useState([])
  const [stats, setStats] = useState([]);
  const [timePeriod, setTimePeriod] = useState('Monthly')
  const [chartData, setChartData] = useState([]); // State for chart data

  

 
    
    console.log('bestselling',bestSellingProducts)

  
  const fetchDashboardInfo = async (period) => {
    
    try {
      const response = await axioInstence.get(`/admin/dashboard?period=${period}`)
      console.log(response);
      setBestSellingProducts(response.data.data.bestSellingProducts)
      setStats(response.data.data.stats)
      setTopCategories(response.data.data.topCategories)
      updateStats(response.data.data.stats) 
      
    } catch (error) {
      console.log(error?.response?.data?.message); 
     }
        
  }
  
   function updateStats(data){
    
    const totalRevenue = data.totalRevenue
    const totalOrders = data.totalOrders
     
     
      setStats([
       { title: "Total Revenue", value: `₹${totalRevenue}`, icon: DollarSign, },
       { title: "Total Orders", value: `${totalOrders}`, icon: ShoppingBag},
       { title: "Total Expenses", value: "₹284.92K", icon: TrendingUp,  },
       { title: "Budget Spent", value: "28.35%", icon: BarChart3,}
      ]);
      
 }
  useEffect(()=>{
    fetchDashboardInfo(timePeriod)
  },[timePeriod])



const handleTimePeriodChange = (event) => {
  setTimePeriod(event.target.value);
};




useEffect(() => {
  const fetchChartData = async () => {

    try {
      const response = await axioInstence.get(`/admin/dashboard/chart-data?period=${timePeriod}`);
      setChartData(response.data); 
      console.log('chart',response);
      
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to fetch chart data. Please try again.');
    } 
  };

  fetchChartData();
}, [timePeriod]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A1D2C]  via-[#8B3A4A] to-[#4A1D2C] p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-[#2D1721]/40 backdrop-blur-md rounded-xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-[#FF7F50]/20">
                <item.icon size={24} className="text-[#FF7F50]" />
              </div>
              <span className={`text-sm ${item.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {item.change}
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-1">{item.value}</h2>
            <p className="text-gray-400">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#2D1721]/40 backdrop-blur-md rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <select 
            value={timePeriod}
            onChange={handleTimePeriodChange}
            className="bg-[#2D1721] bg-opacity-50 rounded-md px-3 py-1 text-sm">
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#2D1721', border: 'none' }} />
              <Line type="monotone" dataKey="revenue" stroke="#FF7F50" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#4CAF50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#2D1721]/40 backdrop-blur-md rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-6">Best Selling Products</h2>
          {bestSellingProducts?.map((product, index) => (
            <div key={index} className="flex justify-between items-center mb-4 last:mb-0">
              <span className="text-gray-400 text-sm font-semibold mr-4">{index + 1}</span>
                <img
                   src={product?.images[0]}
                   alt={product?.productName}
                   className="w-14 h-14 object-cover  rounded-md"
                    />
              <div className="flex flex-1 items-center ml-4">
                <div>
                  <p className="font-medium text-white">{product?.productName}</p>
                  <p className="text-sm text-gray-400">{product?.salesCount} sales</p>
                </div>
              </div>
              <span className="font-medium">{product?.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2D1721]/40 backdrop-blur-md rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-6">Top Categories</h2>
          {topCategories.map((category, index) => (
            <div key={index} className="flex justify-between items-center mb-4 last:mb-0">
              <span>{category?.name}</span>
              <span className="font-medium">{category?.salesCount}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#2D1721]/40 backdrop-blur-md rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-6">Ledger Book</h2>
          <p className="mb-4">Generate a detailed report of your financial transactions.</p>
          <button className="w-full bg-[#FF7F50] hover:bg-[#FF6347] text-white font-bold py-2 px-4 rounded transition duration-300">
            Generate Ledger Report
          </button>
        </div>
      </div>
    </div>
  );
};


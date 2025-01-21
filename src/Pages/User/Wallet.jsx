import React, { useEffect, useState } from 'react';
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, X, CreditCard } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { format } from 'date-fns';
import Pagination from '../../Components/Pagination';
import NavBar from '../../Components/Navbar';
import {fetchWalletInfo, addMoneyToWallet}  from '../../services/authService'
import { BreadcrumbUserDhbrd } from '../../Components/BrudCrums';




const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState([])
  const [transactions, setTransaction]= useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadWalletInfo = async () => {
    try {
        const data = await fetchWalletInfo(); 
        console.log(data);

        if (data) {
            setWalletBalance(data); 
            const sortedTransactions = data.transactions.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setTransaction(sortedTransactions);
        }
    } catch (error) {
        console.error('Error loading wallet info:', error);
        toast.error('Failed to fetch wallet information');
    } 
};

const handleAddMoneyToWallet = async () => {
  try {
      const response = await addMoneyToWallet(amount); 
      console.log(response);
      toast.success(response.message);
      setAmount(''); 
  } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add money to wallet');
      console.log(error);
  }
};

  useEffect(()=>{
    loadWalletInfo()
  },[])

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Dashboard', url: '/user/dashboard' },
    { label: 'wallet', url: null }, 
  ];

  return (
    <>
      <NavBar/>
    <div className="min-h-screen bg-gray-50/50">
          <Toaster position="top-right" reverseOrder={false}/>
      <div className="max-w-6xl mx-auto p-6">
      <BreadcrumbUserDhbrd items={breadcrumbItems}/>
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-8 h-8 text-white" />
                <span className="text-white/80 text-lg">Wallet Balance</span>
              </div>
              <div className="text-5xl font-bold text-white mb-1">
              ₹{parseFloat(walletBalance.balance).toFixed(2)}
              </div>
              <div className="text-white/80">
                Available Balance
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl flex items-center hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Money
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">TRANSACTION DETAILS</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 font-medium text-gray-600">TRANSACTION ID</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">DESCRIPTION</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">DATE</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">TYPE</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-gray-600">{transaction.transactionId.slice(0,8)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' 
                            ? <ArrowDownLeft className="w-4 h-4" /> 
                            : <ArrowUpRight className="w-4 h-4" />
                          }
                        </div>
                        <span className="text-gray-700 font-medium">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                    {format(new Date(transaction.date), 'dd MMM yyyy')}
                      </td>
                    <td className="flex gap-1 py-4 px-6 text-gray-600">
                      {transaction.type}
                      <CreditCard/>
                      </td>
                    <td className={`py-4 px-6 font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{parseFloat(transaction.amount)?.toFixed(2)} 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center py-6 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

        {/* Add Money Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="relative p-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <Wallet className="w-10 h-10 text-orange-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Add Money to your Wallet
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex gap-2">
                {[500, 1000, 2000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => {
                   handleAddMoneyToWallet(amount)
                   setIsModalOpen(false);
                }}
                className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors font-medium"
              >
                Add Money
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    </>
  );
}

export default WalletPage;
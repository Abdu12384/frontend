import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Truck, ShoppingCart, Heart, MapPin, Wallet, LogOut } from 'lucide-react';
import NavBar from '../../Components/Navbar';
import AccountDetailsImg  from '../../assets/images/accountimg.avif'
import OrderHistoryImg  from '../../assets/images/order-history.webp'
import ShoppingCartImg  from '../../assets/images/shoping-cart.jpg'
import AddressImg  from '../../assets/images/address.jpg'
import WishlistImg  from '../../assets/images/wish-list.jpg'
import WalletImg  from '../../assets/images/wallet.jpeg'
const UserDashboard = () => {
  const dashboardItems = [
    {
      title: 'Account Details',
      icon: User,
      image: AccountDetailsImg,
      link: '/user/account-details',
      size: 'large',
      color: 'purple',
      delay: '0s'
    },
    {
      title: 'Order History',
      icon: Clock,
      image: OrderHistoryImg,
      link: '/user/orderdetails',
      size: 'medium',
      color: 'blue',
      delay: '0.1s'
    },
    {
      title: 'Shopping Cart',
      icon: ShoppingCart,
      image: ShoppingCartImg,
      link: '/user/cart',
      size: 'medium',
      color: 'orange',
      delay: '0.3s'
    },
    {
      title: 'Wishlist',
      icon: Heart,
      image: WishlistImg,
      link: '/user/wishlist',
      size: 'tall',
      color: 'red',
      delay: '0.4s'
    },
    {
      title: 'Address',
      icon: MapPin,
      image: AddressImg,
      link: '/user/address',
      size: 'small',
      color: 'indigo',
      delay: '0.5s'
    },
    {
      title: 'Wallet',
      icon: Wallet,
      image: WalletImg,
      link: '/user/wallet',
      size: 'medium',
      color: 'yellow',
      delay: '0.6s'
    }
  ];

  return (
      <>
        <NavBar/>
    <div className="min-h-screen bg-white p-6">
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .dashboard-card {
            animation: slideUp 0.6s ease-out forwards;
            opacity: 0;
          }

          .dashboard-card:hover {
            transform: translateY(-5px);
          }

          .card-large {
            grid-row: span 2;
            grid-column: span 2;
            height: 300px;
          }

          .card-medium {
            grid-column: span 2;
            height: 200px;
          }

          .card-tall {
            grid-row: span 2;
            height: 400px;
          }

          .card-small {
            height: 180px;
          }
        `}
      </style>
{/* <div className="min-h-screen bg-gradient-to-br from-[#f3e7e1] to-[#e7d5c9] py-12"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#3d2516] mb-12 text-center">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`dashboard-card ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''} 
                bg-white rounded-3xl overflow-hidden relative group transition-all duration-300 
                hover:shadow-2xl hover:-translate-y-1 transform`}
              style={{ 
                animationDelay: item.delay,
                height: item.size === 'large' ? '400px' : '200px'
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className={`bg-${item.color}-500/30 p-3 rounded-2xl w-fit mb-3 backdrop-blur-sm`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-200`} />
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:mb-3 transition-all duration-300">{item.title}</h2>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}

          <button
            onClick={() => {/* Add logout logic */}}
            className="dashboard-card bg-white/90 backdrop-blur-sm rounded-3xl p-6 relative group 
              transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform flex items-center justify-center
              hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500"
            style={{ animationDelay: '0.7s', height: '200px' }}
          >
            <div className="flex flex-col items-center transition-all duration-300 group-hover:scale-110">
              <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-white/20">
                <LogOut className="w-8 h-8 text-gray-600 group-hover:text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-white">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDashboard;


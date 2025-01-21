import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/user/product-details/${product._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <div className="relative h-64">
          <img
            src={product.images[0] || '/src/assets/images/default.png'}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 bg-[#8b6c5c] text-white px-2 py-1 m-2 rounded-full text-xs font-bold">
            {product.category}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-[#5b3e31] mb-2">{product.productName}</h3>
          <div className="flex justify-between items-center mb-4">
            {product.variants &&  
            `$${product.variants.find(v => v.weight === '1 kg' || v.weight ==='500 g' )?.salePrice.toFixed(2) || 'N/A'}`
              }
            <span className="text-[#8b6c5c] font-bold">${product.salePrice.toFixed(2)}</span>
            <div className="flex">
              {/* {[...Array(Math.floor(product.rating))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
              ))}
              {product.rating % 1 !== 0 && (
                <Star className="w-5 h-5 fill-current text-yellow-500" style={{ clipPath: `inset(0 ${100 - (product.rating % 1) * 100}% 0 0)` }} />
              )} */}
            </div>
          </div>
          <button className="w-full bg-[#8b6c5c] text-white py-2 px-4 rounded-full hover:bg-[#765341] transition duration-300">
            Order Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;


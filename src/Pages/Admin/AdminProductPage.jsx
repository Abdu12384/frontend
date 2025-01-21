
import React, { useEffect, useState, useRef } from 'react'
import { Search, Plus, Edit2, MoreVertical, X, Podcast } from 'lucide-react'
import AddProduct from '../../Components/AdminComponents/AddProduct' 
import EditProduct from '../../Components/AdminComponents/EditProduct'
import toast, { Toaster } from "react-hot-toast";
import Breadcrumbs from '../../Components/BrudCrums'
import StatusBadge from '../../Components/AdminComponents/StatusBadge'
import Pagination from '../../Components/Pagination'
import { fetchProducts, toggleProductStatus } from '../../services/authService'
import AddProductOffer from '../../Components/AdminComponents/AddProductOffer';
import axioInstence from '../../utils/axioInstence';

export default function AdminProductsPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState([])
  const [menuOpen, setMenuOpen] = useState(null)
  const [showEditProduct, setShowEditProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All")
  const [showAddOffer, setShowAddOffer] = useState(false)
  const productsPerPage = 5

  const formSectionRef = useRef(null)

  useEffect(() => {
    const loadProducts = async () => {
        try {
            const data = await fetchProducts(currentPage, productsPerPage, searchQuery, filterStatus);
            console.log('Fetched products', data);
            setProducts(data.products);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Error loading products', error);
        }
    };

    loadProducts();
}, [currentPage, productsPerPage, searchQuery, filterStatus]); 


 const handleOnProductAdded = () =>{
      setShowAddProduct(false)
 } 


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

   console.log(products);
   
  const handleMenuToggle = (productId) => {
    setMenuOpen(menuOpen === productId ? null : productId)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShowEditProduct(true)
    setShowAddProduct(false)
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddOffer = (product)=>{
     setShowAddOffer(true)
     setSelectedProduct(product)
     if (formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleCancel = () => {
    setShowEditProduct(false)
    setShowAddProduct(false)
    setSelectedProduct(null)
    setShowAddOffer(false)
  }

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    )
    setShowEditProduct(false)
    setSelectedProduct(null)
  }

  const handleAddProductToggle = () => {
    setShowAddProduct((prevState) => {
      const newState = !prevState
      if (newState) {
        setShowEditProduct(false)
        setSelectedProduct(null)
      }
      if (formSectionRef.current) {
        setTimeout(() => {
          formSectionRef.current.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      return newState
    })
  }


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleBlockToggle = async (productId, currentStatus) => {
    try {
        await toggleProductStatus(productId, currentStatus);

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === productId ? { ...product, isDeleted: !product.isDeleted } : product
            )
        );

        toast.success(`Product ${!currentStatus ? 'blocked' : 'unblocked'} successfully!`);
    } catch (error) {
        console.error('Error toggling product status', error);
        toast.error(error.respons.data.message);
    }
};


const handleRemoveOffer = async (productId)=>{
   try {
    
    const response = await axioInstence.patch(`/admin/product/${productId}/remove-offer`)
    console.log(response);
    toast.success(response.data.message)
    
   } catch (error) {
     console.log(error.response.data.message);
     
   }
}


  const getFieldColor = (index) => {
    const colors = ['text-blue-300', 'text-green-300', 'text-yellow-300', 'text-pink-300', 'text-purple-300']
    return colors[index % colors.length]
  }

  return (
    <div className="flex flex-col w-full ml-7">
      <Breadcrumbs />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-16 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Product Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full sm:w-64 bg-white bg-opacity-10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {!showEditProduct && (
            <button
              onClick={handleAddProductToggle}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
            >
              {showAddProduct ? 'Cancel' : 'Add Product'}
              {showAddProduct ? <X /> : <Plus />}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 sm:gap-4">
  {["All", "Active", "Available", "Unavailable", "Blocked"].map((status) => (
    <button
      key={status}
      onClick={() => setFilterStatus(status)}
      className={`
        px-3 py-2 rounded-lg text-sm sm:text-base 
        transition-colors duration-200 ease-in-out
        ${
          filterStatus === status
            ? "bg-purple-600 text-white"
            : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
        }
      `}
    >
      {status}
    </button>
  ))}
</div>

      {/* Product Table */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-6 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-4">Product Name</th>
              <th className="pb-4">Variants</th>
              <th className="pb-4">offerPercentage</th>
              <th className="pb-4">type</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={index} className="border-b border-gray-800 text-white">
                <td className="py-4 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg">
                    {product?.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <span className="text-sm sm:text-base">{product?.productName}</span>
                </td>
                <td className="py-4 text-sm sm:text-base">
                  {product?.variants && product?.variants.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                      {product.variants.map((variant, vIndex) => (
                        <div key={vIndex} className="flex flex-wrap items-center gap-2">
                          {Object.entries(variant)
                          .filter(([key]) => ['stock', 'weight', 'regularPrice', 'salePrice'].includes(key)) // Filter specific keys
                          .map(([key, value], index) => (
                            <span key={index} className={`${getFieldColor(index)} text-xs`}>
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No variants</span>
                  )}
                </td>
                <td className="py-5 text-sm sm:text-base">
                {product?.offer?.offerPercentage ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 font-semibold">
                      {product.offer.offerPercentage}%
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-2"
                        style={{ width: `${product.offer.offerPercentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-200 italic">No Offers</span>
                )}
              </td>              
                <td className="py-2 text-sm sm:text-base">{product?.type}</td>
                <td className="py-2 text-sm sm:text-base">{product.category?.name}</td>
                <td>
                    <StatusBadge
                      status={
                        product.isDeleted
                          ? "Blocked"
                          : (product.variants 
                              ? product.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0)
                              :  0) > 0
                          ? "Available"
                          : "Unavailable"
                      }
                    />
                  </td>
                <td className="py-4">
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-700 rounded-full"
                      onClick={() => handleMenuToggle(product._id)}
                    >
                      <MoreVertical className="h-5 w-5 text-gray-300" />
                    </button>
                    {menuOpen === product._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-50">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                          onClick={() => handleBlockToggle(product._id, product.isDeleted)}
                        >
                          {product.isDeleted ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                        onClick={() => handleAddOffer(product)}
                      >
                        Add Offer
                      </button>
                      {product?.offer && (
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                          onClick={() => handleRemoveOffer(product._id)}
                        >
                          Remove Offer
                        </button>
                      )}
                      </div>
                    )}
                  </div>
                </td>
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
      {/* Add Product Section (Conditionally Rendered) */}
      <div ref={formSectionRef}>
        {showAddProduct && (       
          <AddProduct
            onCancel={handleCancel}
            onProductAdded={handleOnProductAdded}
          />  
        )}

        {showEditProduct && (
          <EditProduct
            product={selectedProduct}
            onCancel={handleCancel}
            onProductAdded={handleProductUpdated}
          />
        )}

        {showAddOffer && (
         <AddProductOffer
         product={selectedProduct}
         onCancel={handleCancel}
         />
        )}
      </div>
    </div>
  )
}
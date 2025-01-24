import React, { useEffect, useState } from "react";
import { ImageIcon,X,Plus } from "lucide-react";
import uploadImageToCloudinary from "../../services/uploadServise";
import { AddProductReq } from "../../services/authService";
import toast, { Toaster } from "react-hot-toast";
import axioInstence from "../../utils/axioInstence";
import ImageCropper from "../ImageCrop";
<Toaster position="top-right" reverseOrder={false}/>

const AddProduct = ({onCancel,onProductAdded}) => {
  const [previewUrl, setPreviewUrl] = useState({});
  const [errors, setErrors]=useState({})
  const [loading,setLoading]= useState(false)
  const [categories, setCategories]= useState([])
  const [showCropper, setShowCropper] = useState(false);
  const [currentImageNum, setCurrentImageNum] = useState(null);
  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    stock: 0, 
    description: "",
    images: [],
    type:[],
    variants:[
      {
        weight: "1 kg",
        flavor:'',
        regularPrice: 0,
        stock:0,
      }
    ],
  });

  const productTypes = ['Birthday','Wedding','Anniversary','Custom']

  useEffect(()=>{

    const fetchCatogroy = async()=>{
      try {
        const response = await axioInstence.get('/admin/categories')

        setCategories(response.data);
      } catch (error) {
        console.error('Error from fecthing Categorys at ProductAdd')
      }
    }
    fetchCatogroy()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index,field, value) =>{
    setProductData((prev)=>({
      ...prev,
      variants: prev.variants.map((variant, i)=>
         i === index ? {...variant,[field]:value}:variant
      )
    }))
  }

  const addVariant = ()=>{
     setProductData((prev)=>({
        ...prev,
        variants:[
          ...prev.variants,
          {
            weight:'1 kg',
            flavor:'',
            regularPrice:0,
            discount:0,
            stock:0,
          }
        ]
     }))
  }

  const removeVariant = (index)=>{
     setProductData((prev)=>({
       ...prev,
       variants:prev.variants.filter((_, i) => i !== index)
     }))
  }

   console.log(productData);
   
   const validateForm = () => {
    const newErrors = {};
  
    const nameRegex = /^[a-zA-Z\s]+$/;

    // Validate product name
    if (!nameRegex.test(productData.productName)) {
      newErrors.productName = "Product name is required";
    }
  
    // Validate category
    if (!productData.category) {
      newErrors.category = "Category is required";
    }
  
    // Validate description
    if (!productData.description.trim()) {
      newErrors.description = "Description is required";
    }
  
    // Validate images
    if (productData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }
  
    // Validate variants
    productData.variants.forEach((variant, index) => {
      if (variant.regularPrice <= 0) {
        newErrors[`variant${index}RegularPrice`] = 'Regular price must be greater than 0';
      }
      if (variant.stock < 0) {
        newErrors[`variant${index}Stock`] = 'Stock cannot be negative';
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleCroppedImage = (croppedFile) => {
    if (croppedFile) {
      const url = URL.createObjectURL(croppedFile);
  
      setPreviewUrl((prev) => ({ ...prev, [currentImageNum]: url }));
  
      setProductData((prev) => {
        const newImages = [...prev.images];
        newImages[currentImageNum - 1] = croppedFile; 
        return {
          ...prev,
          images: newImages,
        };
      });
  
      setShowCropper(false);
      setCurrentImageNum(null);
    }
  };

  const handleImageChange = (e, num) => {
      setCurrentImageNum(num);
      setShowCropper(true);
  };


  // const handleImageChange = (e, num) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl((prev) => ({ ...prev, [num]: url }));

  //     setProductData((prev) => ({
  //       ...prev,
  //       images: [...prev.images, file],
  //     }));
  //   }
  // };

  const handleRemoveImage = (num) => {
    setPreviewUrl((prev) => {
      const newPreviewUrl = { ...prev };
      delete newPreviewUrl[num];
      return newPreviewUrl;
    });

    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== num - 1),
    }));
  };


  


  const handleTypeChange = (type) => {
    setProductData((prev) => {
      const newTypes = prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type];
      return {
        ...prev,
        type: newTypes
      };
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return
    setLoading(true)
    try {
      let imageUrls = [];
      if (productData.images && productData.images.length > 0) {

        imageUrls = await uploadImageToCloudinary(productData.images);
      }

      const productPayload = {
        ...productData,
        images: imageUrls,
      };
      const result = await AddProductReq(productPayload);
       console.log('result addproduct here',result);
       
      toast.success(result.data.message)
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      console.error("Add Product Error:", error.response.data.message);
      toast.error(error.response.data.message)

    }finally{
      setLoading(false)
    }
  };






  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 sm:p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-gray-300 bg-gray-800  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 text-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Types
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {productTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={productData.type.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-300">{type}</span>
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 text-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
        </div>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
              >
                {!previewUrl[num] && (
                  <div 
                  onClick={(e) => handleImageChange(e, num)}
                  className="flex flex-col items-center justify-center space-y-2">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Browse Image</span>
                  </div>
                )}
                {/* <input
                  type="file"
                  onChange={(e) => handleImageChange(e, num)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                /> */}
                 {previewUrl[num] && (
                  <>
                    <img
                      src={previewUrl[num]}
                      alt={`Preview ${num}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(num)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentImageNum(num);
                        setShowCropper(true);
                      }}
                      className="absolute bottom-2 left-2 p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                    >
                      Crop
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
        </div>

        <div>
          <label className="block text-sm   font-medium text-gray-700 mb-2">Variants</label>
          {productData.variants.map((variant, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md p-4  rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">Variant {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <select
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                    className="w-full  px-3 py-2 border border-gray-300 text-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1 kg">1 kg</option>
                    <option value="2 kg">2 kg</option>
                    <option value="500 g">500 g</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
                  <input
                    type="number"
                    value={variant.regularPrice}
                    onChange={(e) => handleVariantChange(index, 'regularPrice', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                   {errors[`variant${index}RegularPrice`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`variant${index}RegularPrice`]}</p>
                    )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`customization-${index}`}
                    checked={variant.customization}
                    onChange={(e) => handleVariantChange(index, 'customization', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`customization-${index}`} className="ml-2 block text-sm text-gray-900">
                    Customization Available
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Variant
          </button>
          {errors.variants && <p className="text-red-500 text-xs mt-1">{errors.variants}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
      {showCropper && (
      <ImageCropper
        onCropComplete={handleCroppedImage}
        onCancel={() => {
          setShowCropper(false);
          setCurrentImageNum(null);
        }}
      />
    )}
    </div>
 
  );
};

export default AddProduct;


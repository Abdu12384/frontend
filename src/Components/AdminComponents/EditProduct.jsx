

import React, { useState, useEffect } from 'react';
import { ImageIcon, Plus, Minus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import uploadImageToCloudinary from "../../services/uploadServise";
import { updatedProductReq } from "../../services/authService";

export default function EditProductWithVariants({ product, onCancel }) {
  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    description: "",
    images: [],
    variants: []
  });
  const [previewUrls, setPreviewUrls] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setProductData({
        productName: product.productName,
        category: product.category,
        description: product.description,
        images: product.images || [],
        variants: product.variants || []
      });
      setPreviewUrls(
        product.images.reduce((acc, img, index) => {
          acc[index + 1] = img;
          return acc;
        }, {})
      );
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addVariant = () => {
    setProductData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          weight: '1 kg',
          flavor: '',
          regularPrice: 0,
          discount: 0,
          stock: 0,
          customization: false
        }
      ]
    }));
  };

  const removeVariant = (index) => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e, num) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [num]: url }));
      setProductData(prev => {
        const updatedImages = [...prev.images];
        updatedImages[num - 1] = file;
        return { ...prev, images: updatedImages };
      });
    } else {
      setPreviewUrls(prev => {
        const updatedPreview = { ...prev };
        delete updatedPreview[num];
        return updatedPreview;
      });
      setProductData(prev => {
        const updatedImages = [...prev.images];
        updatedImages[num - 1] = null;
        return { ...prev, images: updatedImages };
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (productData.variants.length === 0) {
      newErrors.variants = "At least one variant is required";
    }
    productData.variants.forEach((variant, index) => {
      if (variant.regularPrice <= 0) {
        newErrors[`variant${index}RegularPrice`] = "Regular price must be greater than 0";
      }
    
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const newImages = productData.images
        .map((img, index) => ({ img, index }))
        .filter(({ img }) => img instanceof File);

      let imageUrls = [...productData.images];

      if (newImages.length > 0) {
        const uploadedImageUrls = await uploadImageToCloudinary(newImages.map(({ img }) => img));
        newImages.forEach(({ index }, i) => {
          imageUrls[index] = uploadedImageUrls[i];
        });
      }

      const updatedProduct = {
        ...productData,
        images: imageUrls.filter((img) => img),
      };
      console.log(updatedProduct);
      

      const result = await updatedProductReq(product._id, updatedProduct);
      console.log(result);
      
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Update Product Error:", error);
      toast.error("Could not update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 sm:p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Edit Product</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Image Upload Section */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors relative"
            >
              {!previewUrls[num] ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Browse Image</span>
                </div>
              ) : (
                <img
                  src={previewUrls[num]}
                  alt={`Preview ${num}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                onChange={(e) => handleImageChange(e, num)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-600 text-sm">{errors.productName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Category</label>
              <select
                name="category"
                onChange={handleChange}
                value={productData.category}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Vanilla Cakes</option>
                <option>Chocolate Cakes</option>
                <option>Custom Cakes</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            {/* Variants Section */}
            <div>
              <label className="block text-gray-400 mb-2">Variants</label>
              {productData.variants.map((variant, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white">Variant {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Weight</label>
                      <select
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option>1 kg</option>
                        <option>2 kg</option>
                        <option>500 g</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Regular Price</label>
                      <input
                        type="number"
                        value={variant.regularPrice}
                        onChange={(e) => handleVariantChange(index, 'regularPrice', parseFloat(e.target.value))}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                      />
                      {errors[`variant${index}RegularPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`variant${index}RegularPrice`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                    {/* <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`customization-${index}`}
                        checked={variant.customization}
                        onChange={(e) => handleVariantChange(index, 'customization', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`customization-${index}`} className="ml-2 block text-sm text-gray-300">
                        Customization Available
                      </label>
                    </div> */}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="inline-block mr-2" size={20} />
                Add Variant
              </button>
              {errors.variants && <p className="text-red-500 text-xs mt-1">{errors.variants}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full bg-gray-600 text-white rounded-lg p-2 hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
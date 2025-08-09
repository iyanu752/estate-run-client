import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProduct = async (productData: any) => {
  try {
    const token = localStorage.getItem("token") 
    const response = await axios.post(
      API_ENDPOINTS.PRODUCTS,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating product:", error.response?.data || error.message)
    throw error
  }
}

const getProducts = async () => {
    try{
        const response = await axios.get(API_ENDPOINTS.PRODUCTS)
        return response.data;
    }catch (error) {
        console.error("Error fetching products:", error)
    }
}

const getProductsBySupermarket = async (id: string) => {
    try{
        const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}/supermarket/${id}`)
        return response.data;
    }catch (error) {
        console.error('Error fetching products by supermarket Id:', error)
        return [];
    }
}

const getProductsByVendor = async (id: string) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}/vendor/${id}`)
        return response.data;
    }catch(error) {
        console.error("Error fetching products by Id:", error)
    }
}


const getProductsById = async (id: string) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}/${id}`)
        return response.data;
    }catch(error) {
        console.error("Error fetching products by Id:", error)
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProduct = async (id: string, updatedProductData: any) => {
    try{
        const response = await axios.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, updatedProductData)
        return response.data;
    }catch(error) {
        console.error("Error updating product:", error)
    } 
}

const deleteProduct = async (id: string) => {
    try {
        const response = await axios.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`)
        return response.data;
    }catch (error) {
        console.error ("Error deleting product: ", error)
    }
}   

export { createProduct, getProductsByVendor, getProductsById, getProducts, updateProduct, deleteProduct, getProductsBySupermarket }
import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";

const addToCart = async (
 payload: {
   userId: string,
  productId: string,
  quantity: number,
  supermarket?: string,
 }
): Promise<{ success: boolean; message: string }> => {
  try {
    const {userId} = payload
    const response = await axios.post(
      `${API_ENDPOINTS.CART}/${userId}`, payload
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: 'Unexpected response from server' };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errMessage =
      error?.response?.data?.message || 'Failed to add to cart.';
    return { success: false, message: errMessage };
  }
};


const fetchCart = async (userId: string) => {
  const res = await axios.get(`${API_ENDPOINTS.CART}/${userId}`);
  return res.data;
};

const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  const res = await axios.put(`${API_ENDPOINTS.CART}/${userId}/${productId}/${quantity}`);
  return res.data;
};

const removeCartItem = async (userId: string, productId: string) => {
  const res = await axios.delete(`${API_ENDPOINTS.CART}/${userId}/${productId}`);
  return res.data;
};

const clearCart = async (userId: string) => {
  const res = await axios.delete(`${API_ENDPOINTS.CART}/${userId}`);
  return res.data;
};

const getTotal = async (userId: string) => {
  const res = await axios.get(`${API_ENDPOINTS.CART}/total/${userId}`);
  return res.data;
};

export { addToCart, fetchCart, updateCartItem, removeCartItem, clearCart, getTotal };
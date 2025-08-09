import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";

const getSupermarket = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SUPERMARKET);
    return response.data
  } catch (error) {
    console.error('error getting supermarket', error)
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSupermarket = async (id: string, data: any) => {
  try{
    const response = await axios.put(`${API_ENDPOINTS.SUPERMARKET}/${id}`, data)
    return response.data;

  }catch (error) {
    console.error('Error updating supermarket', error)
  }
}


const updateStatus = async (id: string , payload: {isOpen: boolean}) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.SUPERMARKET}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating supermarket status', error);
  }
};


export { getSupermarket, updateStatus, updateSupermarket }

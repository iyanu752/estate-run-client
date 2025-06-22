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

const updateStatus = async (id: string | undefined, status: string) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.SUPERMARKET}/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating supermarket status', error);
  }
};


export { getSupermarket, updateStatus }

import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";


 const getVendorDashboard = async (supermarketId: string, range: string = 'today') => {
  const response = await axios.get(API_ENDPOINTS.VENDORDASHBOARD, {
    params: { supermarketId, range }
  });
  return response.data;
};


export {getVendorDashboard }
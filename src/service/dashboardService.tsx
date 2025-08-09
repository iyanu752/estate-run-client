import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";

export const getVendorDashboard = async (supermarketId: string, range: string = 'today') => {
  const response = await axios.get(API_ENDPOINTS.VENDORDASHBOARD, {
    params: { supermarketId, range }
  });
  return response.data;
};

export const getRiderDashboard = async (riderId: string) => {
  const response = await axios.get(`${API_ENDPOINTS.RIDERDASHBOARD}rider/${riderId}`);
  return response.data;
};

export const getAdminDashboard = async (adminId: string) => {
  const response = await axios.get(`${API_ENDPOINTS.ADMINDASHBOARD}admin/${adminId}`);
  return response.data;
}

export const getAllUsers = async () => {
  const response = await axios.get(`${API_ENDPOINTS.ADMINDASHBOARD}users`);
  return response.data;
}

export const getAllVendors = async () => {
  const response = await axios.get(`${API_ENDPOINTS.ADMINDASHBOARD}vendors`);
  return response.data;
}

export const getAllRiders = async () => {
  const response = await axios.get(`${API_ENDPOINTS.ADMINDASHBOARD}riders`);
  return response.data;
}

import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";


const getVendorProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PROFILE}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile: ', error);
    throw error;
  }
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProfile = async (id: string, updatedProfile: any) => {
    try {
        const response = await axios.put(`${API_ENDPOINTS.PROFILE}/${id}`, updatedProfile)
        return response.data;

    }catch (error) {
        console.error("Error updating profile:", error)
    }  
}

 const deleteProfile = async (id: string) => {
    try {
        const response = await axios.delete(`${API_ENDPOINTS.PROFILE}/${id}`)
        return response.data
    }catch (error) {
        console.error("Error deleting profile: ", error)
    }
 } 

export {getVendorProfile, updateProfile, deleteProfile}
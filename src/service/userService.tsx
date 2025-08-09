import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";

const getUser = async (userId: string) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.USERS}/${userId}`)
        return response.data
    }catch (error) {
        console.error("Error fetching user:", error);

    }
}

export { getUser}
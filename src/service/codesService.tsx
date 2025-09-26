import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios";

interface VerificationCode {
  visitorName: string;
  visitorPhone: number;
  purposeOfVisit: string;
  date: string;
  from: string;
  to: string;
  specialInstructions: string;
}

interface VerifyCode {
    id: string;
    verificationCode: number;
}

const createVerifyCode = async (verificationCode: VerificationCode) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.CODE}`,
      verificationCode
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create verification code", error);
  }
};

const getVerifyCode = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CODE}`);
    return response.data;
  } catch (error) {
    console.error("unable to fetch cart data", error);
  }
};

const getVerifyCodeByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CODE}/user/${userId}`)
    return response.data;
  }catch(error){
    console.error('error in getting codes by userId', error)
  }
}

const getVerifyCodeById = async (codeId: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CODE}/${codeId}`);
    return response.data;
  } catch (error) {
    console.error("Unable to get user code by Id", error);
  }
};

const updateVerifyCode = async (
  codeId: string,
  verificationCode: VerificationCode
) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS}/${codeId}`,
      verificationCode
    );
    return response.data;
  } catch (error) {
    console.error("error in updating verification", error);
  }
};

const deleteVerifyCode = async (codeId: string) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS}/${codeId}`);
    return response.data
  } catch (error) {
    console.error("unable to delete verification code", error);
  }
};

const verifyCode = async (verificationCode: VerifyCode) => {
    try{
        const response = await axios.post(`${API_ENDPOINTS}/verify`, verificationCode)
        return response.data
    }catch (error) {
        console.error('error veryfing the codes', error)
    }
}

export { createVerifyCode, getVerifyCode, getVerifyCodeById, updateVerifyCode, deleteVerifyCode, verifyCode, getVerifyCodeByUserId };

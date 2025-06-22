import API_ENDPOINTS from "@/config/endpoints";
import axios, { AxiosError } from "axios";

const loginUser = async (email: string, password: string, userType: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
      userType,
    });

    const { user, token } = response.data;

    if (response.status === 201 || response.status === 200) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { success: true, message: "Login successful" };
    }
  } catch (error) {
    const err = error as AxiosError;
    const resMessage = err.response?.data;
    const message = Array.isArray(resMessage)
      ? resMessage.join(", ")
      : resMessage || "Login failed. Please try again.";
    return { success: false, message };
  }
};

const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address: string,
  phone: number,
  userType: string,
  estate: string,
  businessDescription?: string,
  businessPhoneNumber?: number,
  businessName?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const payload = {
      firstName,
      lastName,
      email,
      password,
      address,
      phone,
      userType,
      estate,
      // Only include business fields if it's a vendor
      ...(userType === 'vendor' && {
        businessName,
        businessDescription,
        businessPhoneNumber,
      }),
    };

    const response = await axios.post(API_ENDPOINTS.SIGNUP, payload);

    if (response.data && response.data.user) {
      return { success: true, message: 'Signup successful' };
    } else {
      return { success: false, message: 'Signup failed' };
    }
  } catch (err) {
    console.error('Signup failed', err);
    
    // Handle axios error response
    if (axios.isAxiosError(err) && err.response?.data) {
      const errorMessage = err.response.data.message || 'Signup failed. Please try again.';
      return { success: false, message: errorMessage };
    }
    
    const message = 'Signup failed. Please try again.';
    return { success: false, message };
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGOUT);
    if (response.data && response.status === 200) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { success: true, message: "Logout successful" };
    }
  } catch (err) {
    console.error("Logout failed", err);
    return { success: false, message: "Logout failed" };
  }
};

export { loginUser, signupUser, logoutUser };
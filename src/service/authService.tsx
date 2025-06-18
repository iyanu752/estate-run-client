import API_ENDPOINTS from "@/config/endpoints";
import axios from "axios"

const loginUser = async (email: string, password: string, userType: string) => {
    try {
          const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email, 
        password,
        userType
    });
    const { message, user, userId, token } = response.data;
    if (response.status === 200) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, message };
    }
    }catch (err) {
        console.log("Login failed", err)
        return {success: false, message: 'Login failed.'}
    }  
}


 const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address: string,
  phone: number,
  userType: string,
  estate: string,
  businessAddress?: string,
  businessDescription?: string,
  businessPhone?: number,
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
      businessAddress,
      businessDescription,
      businessPhone,
      businessName,
    };

    const response = await axios.post(API_ENDPOINTS.SIGNUP, payload);

    if (response.data && response.data.user) {
      return { success: true, message: 'Signup successful' };
    } else {
      return { success: false, message: 'Signup failed' };
    }
  } catch (err) {
    console.error('Signup failed', err);
    const message = 'Signup failed. Please try again.';
    return { success: false, message };
  }
};


const logoutUser = async () => {
    try{
        const response = await axios.post(API_ENDPOINTS.LOGOUT)
        if (response.data && response.status === 200) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return {success: true, message: "Logout sucessful"}
        }
    }catch(err) {
        console.error("Logout failed", err)
      return {sucess: false, message: "Logout failed"}
    }
}

export { loginUser, signupUser, logoutUser}
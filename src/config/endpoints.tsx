const BASE_URL = "mongodb://localhost:27017/estate_run";

const API_ENDPOINTS = {
LOGIN: `${BASE_URL}/auth/login`,
SIGNUP: `${BASE_URL}/auth/signup`,
LOGOUT: `${BASE_URL}/auth/logout`
}

export default API_ENDPOINTS;
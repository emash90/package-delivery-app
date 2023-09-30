//import { userAPI } from "../../axios/axios";
import axios from "axios";
import { userAPI } from "../../axios/axios";


//const userAPI = '/api/users/'

//register user

const register = async (userData) => {
    const response = await axios.post(userAPI.defaults.baseURL + "register", userData);

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

//login user
const login = async (userData) => {
    console.log("userAPI", userAPI.defaults.baseURL);
    const response = await axios.post(userAPI.defaults.baseURL + "login", userData)
    console.log("response", response);

    if (response.data) {
        const data = JSON.stringify(response.data);
        localStorage.setItem("user", data);
        localStorage.setItem(
            "userType",
            JSON.stringify(response.data.userType)
        );
    } 
    return response.data;
};
// get all users
const getAllUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(userAPI.defaults.baseURL + "allusers", config);
    return response.data;
};
//logout user
const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
};

const authService = {
    register,
    logout,
    login,
    getAllUsers,
};
export default authService;

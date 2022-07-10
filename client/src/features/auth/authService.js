import axios from "axios";

//export const baseURL = process.env.REACT_APP_BASE_URL;

const API_URL = "https://package-delivery-project.herokuapp.com/api/users/";

//register user

const register = async (userData) => {
    const response = await axios.post(API_URL + "register", userData);

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

//login user
const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);

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
    const response = await axios.get(API_URL + "allusers", config);
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

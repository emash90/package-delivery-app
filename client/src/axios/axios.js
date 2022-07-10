import axios from "axios";

const userAPI = axios.create({
 baseURL: "https://package-delivery-project.herokuapp.com/api/users",
});

export default userAPI;
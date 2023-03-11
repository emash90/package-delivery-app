import axios from "axios";



const userAPI = axios.create({
 baseURL: "http://localhost:5050/api/users",
});

const packageAPI = axios.create({
    baseURL: "http://localhost:5050/api/package",
});

const deliveryAPI = axios.create({
    baseURL: "http://localhost:5050/api/delivery",
});

export { userAPI, packageAPI, deliveryAPI };
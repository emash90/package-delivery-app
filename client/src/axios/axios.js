import axios from "axios";

if (process.env.NODE_ENV === "production") {
 axios.defaults.baseURL = "69.164.217.119";
} else {
    axios.defaults.baseURL = "http://localhost:5050";
}

const userAPI = axios.create({
 baseURL: axios.defaults.baseURL + "/api/users",
});

const packageAPI = axios.create({
    baseURL: axios.defaults.baseURL + "/api/package",
});

const deliveryAPI = axios.create({
    baseURL: axios.defaults.baseURL + "/api/delivery",
});

export { userAPI, packageAPI, deliveryAPI };
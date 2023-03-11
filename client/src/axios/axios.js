import axios from "axios";

const API_URL = process.env.API_BASE_URL

const userAPI = axios.create({
    baseURL: API_URL + "/api/users/"
});

const packageAPI = axios.create({
    baseURL: API_URL + "/api/package/"
});

const deliveryAPI = axios.create({
    baseURL: API_URL + "/api/delivery/"
});

export { userAPI, packageAPI, deliveryAPI };

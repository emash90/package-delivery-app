import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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

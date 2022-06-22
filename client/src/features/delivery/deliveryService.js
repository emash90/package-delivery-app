import axios from "axios";

const API_URL = "http://localhost:5050/api/delivery/";

//create delivery

const createDelivery = async (newDelivery, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, newDelivery, config);
    console.log(newDelivery);
    return response.data;
};
//get all user deliveries

const getDeliveries = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);

    return response.data;
};

//get all the deliveries
const getAllDeliveries = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + "alldeliveries", config);

    return response.data;
};

//get one Delivery

const getOneDelivery = async (deliveryID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + deliveryID, config);

    return response.data;
};

//update delivery
const updatedDelivery = async (deliveryDataObj, token) => {
    const id = deliveryDataObj.id
    const deliveryData = deliveryDataObj.deliveryData
    const config = await {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(`${API_URL}${id}`, deliveryData, config);

    return response.data;
};

//delete user delivery

const deleteDelivery = async (deliveryID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + deliveryID, config);

    return response.data;
};
const deliveryService = {
    createDelivery,
    getDeliveries,
    getOneDelivery,
    updatedDelivery,
    deleteDelivery,
    getAllDeliveries,
};
export default deliveryService;

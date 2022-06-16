import axios from "axios";

const API_URL = "http://localhost:5050/api/package/";

//create package

const createPackage = async (newPackage, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, newPackage, config);

    return response.data;
};
//get all user packages

const getPackages = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);

    return response.data;
};
const getAllPackages = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + "allpackages", config);

    return response.data;
};

//get one package

const getOnePackage = async (packageId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + packageId, config);

    return response.data;
};

//update package
const updatedPackage = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(API_URL + id, config);

    return response.data;
};

//delete user packages

const deletePackage = async (packageId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + packageId, config);

    return response.data;
};
const packageService = {
    createPackage,
    getAllPackages,
    getPackages,
    deletePackage,
    getOnePackage,
    updatedPackage,
};
export default packageService;

import axios from "axios";
import { packageAPI }  from "../../axios/axios";

//const API_URL = "/api/package/";

//create package

const createPackage = async (newPackage, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(packageAPI.defaults.baseURL, newPackage, config);

    return response.data;
};
//get all user packages

const getPackages = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(packageAPI.defaults.baseURL, config);

    return response.data;
};
const getAllPackages = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(packageAPI.defaults.baseURL + "allpackages", config);

    return response.data;
};

//get one package

const getOnePackage = async (packageId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(packageAPI.defaults.baseURL + packageId, config);

    return response.data;
};

//update package
const updatedPackage = async (updateData, token) => {
    const id = updateData.id
    const packageData = updateData.packageData
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(packageAPI.defaults.baseURL + id, packageData, config);

    return response.data;
};

//delete user packages

const deletePackage = async (packageId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(packageAPI.defaults.baseURL + packageId, config);

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

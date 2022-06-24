import React from 'react'
import { useSelect } from "@mui/base";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createDelivery, getOneDelivery, updatedDelivery } from "../../features/delivery/deliverySlice";
import { getOnePackage } from "../../features/packages/packageSlice";
import { Radio, Grid, TextField, Button, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import SpinnerComponent from '../SpinnerComponent';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5050");


function DeliveryEdit({ oneDelivery, onePackage }) {
    console.log(oneDelivery);
    
    const [statusValue, setStatusValue] = useState("");
    const handleClick = (event) => {
        setStatusValue(event.target.value);
    };
    const handleGoBack =() => {
        navigate('/driverdashboard/mydeliveries')
    }
    let { id } = useParams();
    useEffect(() => {
        dispatch(getOneDelivery(id));
    }, [getOneDelivery]);
    const { isLoading, isSuccess, message, deliveries, allPackages } =
        useSelector((state) => state.deliveries);
        useEffect(() => {
            if (oneDelivery) {
                setFormData({ ...oneDelivery });
            }
        }, [oneDelivery]);
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState("");
    const [formData, setFormData] = useState({
        packageId: id,
        pickup_time: "",
        start_time: "",
        end_time: "",
        status: "",
        packageTo: onePackage.to_address,
        packageFrom: onePackage.from_address,
        packageDescription: onePackage.description,
    });
    const {
        packageId,
        pickup_time,
        start_time,
        end_time,
        status,
        packageTo,
        packageFrom,
        packageDescription,
    } = formData;
    const dispatch = useDispatch();
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = async (e) => {
        try {
            await e.preventDefault();
            const deliveryData = await {
                packageId,
                pickup_time,
                start_time,
                end_time,
                status,
                packageTo,
                packageFrom,
                packageDescription,
            };
            const deliveryDataObj = {
                deliveryData,
                id
            }
            await dispatch(updatedDelivery(deliveryDataObj));
            socket.emit("statusSet", {status, packageId})
            console.log(deliveryData);
            setFormData({
                packageId: "",
                packageDescription: "",
                pickup_time: "",
                start_time: "",
                end_time: "",
                status: "",
                packageFrom: "",
                packageTo: ""
            });
            console.log(deliveryData);
            navigate("/driverdashboard/mydeliveries");
        } catch (error) {
            console.log(error);
        }
    };
    if (isLoading) {
        return <SpinnerComponent />;
    }
    return (
        <section className="form">
            <form onSubmit={onSubmit}>
                <Grid container mt={3} direction="column">
                    <Grid item mb={3} lg>
                        <TextField
                            style={{width: '45%'}}
                            type="text"
                            name="packageId"
                            value={`Delivery for PackageId: ${packageId}`}
                            disabled
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item mb={3} lg>
                        <TextField
                            style={{width: '45%'}}
                            type="text"
                            name="packageDescription"
                            value={`Delivery for: ${packageDescription}`}
                            disabled
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item mb={3} lg>
                        <TextField 
                            label='pickup time'
                            focused
                            type='date'
                            value={pickup_time}
                            onChange={onChange}
                            name='pickup_time'
                            style={{ width: "45%", marginRight: "22px" }}
                        />
                        </Grid>
                        <Grid item mb={3} lg>
                        <TextField
                            label='start time'
                            focused
                            value={start_time}
                            onChange={onChange}
                            type='date'
                            name='start_time'
                            style={{ width: "45%" }}
                        />
                    </Grid>
                    <Grid item mb={3} lg>
                        <TextField
                            label='end time'
                            focused
                            onChange={onChange}
                            type='date'
                            name='end_time'
                            value={end_time}
                            style={{ width: "45%", marginRight: "22px" }}
                        />
                    </Grid>
                  
                </Grid>
                <FormControl>
                        <FormLabel id="deliveryStatus">Delivery Status</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="delivery status"
                            name="status"
                            value={status}
                            onClick={handleClick}
                            onChange={onChange}
                        >
                            <FormControlLabel
                                value="Picked Up"
                                control={<Radio />}
                                label="picked up"
                            />
                            <FormControlLabel
                                value="in transit"
                                control={<Radio />}
                                label="in transit"
                            />
                            <FormControlLabel
                                value="delivered"
                                control={<Radio />}
                                label="delivered"
                            />
                            <FormControlLabel
                                value="failed"
                                control={<Radio />}
                                label="failed"
                            />
                        </RadioGroup>
                    </FormControl>
                <div style={{ marginTop: "1rem" }}>
                    <Button
                        style={{ width: "40%", marginRight: "10rem" }}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={handleGoBack}
                        style={{ width: "40%" }}
                        variant="contained"
                        color="secondary"
                        type="button"
                    >
                        Go back
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default DeliveryEdit;
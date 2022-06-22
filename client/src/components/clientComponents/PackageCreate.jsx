import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPackage } from "../../features/packages/packageSlice";
import {
    Grid,
    TextField,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import SpinnerComponent from "../SpinnerComponent";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";


const PackageCreate = ({ currentLocation }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
console.log(currentLocation);
const [fromLocation, setFromLocation] = useState({lat: '', long: ''})
useEffect(() => {
        if (currentLocation) {
            setFromLocation({lat: currentLocation.lat, long: currentLocation})
    }}, [currentLocation]);
    const { isError, Message, isLoading, isSuccess } = useSelector(
        (state) => state.packages
    );
    const handleGoBack = () => {
        navigate("/dashboard")
    }
    const [formData, setFormData] = useState({
        description: "",
        height: "",
        weight: "",
        depth: "",
        packageStatus: "open",
        width: "",
        from_name: "",
        from_address: "",
        from_locationLatitude: "",
        from_locationLongitude: "",
        to_name: "",
        to_address: "",
        to_locationLatitude: "",
        to_locationLongitude: "",
    });
    const {
        description,
        height,
        weight,
        depth,
        width,
        from_name,
        from_address,
        from_locationLatitude,
        from_locationLongitude,
        to_address,
        to_name,
        to_locationLatitude,
        to_locationLongitude,
        packageStatus,
    } = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = async (e) => {
        try {
            await e.preventDefault();
            const packageData = await {
                description,
                height,
                weight,
                depth,
                width,
                from_name,
                from_address,
                from_locationLatitude,
                from_locationLongitude,
                to_name,
                to_address,
                to_locationLatitude,
                to_locationLongitude,
                packageStatus,
            };
            await dispatch(createPackage(packageData));
            setFormData({
                description: "",
                height: "",
                weight: "",
                depth: "",
                width: "",
                from_name: "",
                from_address: "",
                from_location: {
                    from_locationLatitude: "",
                    from_locationLongitude: "",
                },
                to_name: "",
                to_address: "",
                to_locationLatitude: "",
                to_locationLongitude: "",
                packageStatus: "open",
            });
            navigate("/dashboard");
            toast("Package added successfuly", {
                position: toast.POSITION.TOP_CENTER,
            });
        } catch (error) {
            console.log(error);
        }
    };
    if (isLoading) {
        return <SpinnerComponent />;
    }
    return (
        <>
            <h4>Create Package</h4>
            <form onSubmit={onSubmit}>
                <Grid container mt={3} direction="column">
                    <Grid item mb={3}>
                        <TextField
                            fullWidth
                            id="description"
                            label="package description"
                            type="text"
                            name="description"
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item mb={3} lg>
                        <TextField
                            id="packageFromName"
                            label="sender's name"
                            type="text"
                            name="from_name"
                            value={from_name}
                            onChange={onChange}
                            style={{ width: "45%", marginRight: "22px" }}
                        />
                        <TextField
                            id="packageToName"
                            label="receiver's name"
                            type="text"
                            name="to_name"
                            value={to_name}
                            onChange={onChange}
                            style={{ width: "45%" }}
                        />
                    </Grid>
                    <Autocomplete>
                    <Grid item mb={3} lg>
                        <TextField
                            id="packageFromAddress"
                            label="sender's address"
                            type="text"
                            name="from_address"
                            value={from_address}
                            onChange={onChange}
                            style={{ width: "45%", marginRight: "22px" }}
                        />
                        <TextField
                            id="packageToAddress"
                            label="receiver's address"
                            type="text"
                            name="to_address"
                            value={to_address}
                            onChange={onChange}
                            style={{ width: "45%" }}
                        />
                    </Grid>
                    </Autocomplete>

                    <Grid item mb={3}>
                        <TextField
                            id="height"
                            label="height (cm)"
                            type="number"
                            name="height"
                            value={height}
                            onChange={onChange}
                            style={{ marginRight: "15px" }}
                        />
                        <TextField
                            id="width"
                            label="width (cm)"
                            type="number"
                            name="width"
                            value={width}
                            onChange={onChange}
                            style={{ marginRight: "15px" }}
                        />
                        <TextField
                            id="weight"
                            label="weight (g)"
                            type="number"
                            name="weight"
                            value={weight}
                            onChange={onChange}
                            style={{ marginRight: "15px" }}
                        />
                        <TextField
                            id="depth"
                            label="depth (cm)"
                            type="number"
                            name="depth"
                            value={depth}
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="senderLocationLatitude"
                            label="sender's location latitude"
                            type="number"
                            name="from_locationLatitude"
                            value={from_locationLatitude}
                            onChange={onChange}
                        />
                        <TextField
                            id="senderLocationLongitude"
                            label="sender's location longitude"
                            type="number"
                            name="from_locationLongitude"
                            value={from_locationLongitude}
                            onChange={onChange}
                            style={{ marginRight: "3.5rem" }}
                        />
                        <TextField
                            id="receiverLocationLatitude"
                            label="receiver location latitude"
                            type="number"
                            name="to_locationLatitude"
                            value={to_locationLatitude}
                            onChange={onChange}
                        />
                        <TextField
                            id="receiverLocationLongitude"
                            label="receiver location longitude"
                            type="number"
                            name="to_locationLongitude"
                            value={to_locationLongitude}
                            onChange={onChange}
                        />
                    </Grid>
                </Grid>
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
        </>
    );
};
export default PackageCreate;

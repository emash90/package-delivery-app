import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Button } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    getOnePackage,
    deletePackage,
    getPackages,
} from "../../features/packages/packageSlice";
import { toast } from "react-toastify";
import MapComponent from "../MapComponent";

function PackageDetails({ user }) {
    const onePackage = useSelector((state) => state.packages.onePackage);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getOnePackage(id));
    }, [getOnePackage]);

    const goHome = () => {
        if(user.userType === "driver"){
        navigate("/dashboard")
        } else {
            navigate("/admin")
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("are you sure you want to delete the package?")) {
            await dispatch(deletePackage(id));
            navigate("/dashboard");

            dispatch(getPackages());
            toast("package delete successful", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };
    const handleEdit = (id) => {
        navigate(`/dashboard/edit/${id}`);
    };
    const handleDeliver = (id) => {
        navigate(`/driverdashboard/createdelivery/${id}`);
    };
    const bull = (
        <Box
            component="span"
            sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
        ></Box>
    );
    const card = (
        <Container>
            <Row>
                <Col md={4}>
                    <React.Fragment>
                        <CardContent>
                            <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                            >
                                packageID: {onePackage._id}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {onePackage.description}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Package from:{" "}
                                <span
                                    style={{
                                        fontWeight: "bolder",
                                        textTransform: "uppercase",
                                        color: "black",
                                    }}
                                >
                                    {" "}
                                    {onePackage.from_name}{" "}
                                </span>
                                <br />
                                from: {onePackage.from_address}
                                <br />
                                latitude: {
                                    onePackage.from_locationLatitude
                                }{" "}
                                longitude {onePackage.from_locationLongitude}
                                <br />
                            </Typography>

                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                to:{" "}
                                <span
                                    style={{
                                        fontWeight: "bolder",
                                        textTransform: "uppercase",
                                        color: "black",
                                    }}
                                >
                                    {onePackage.to_name}
                                </span>
                                <br />
                                in: {onePackage.to_address}
                                <br />
                                latitude: {onePackage.to_locationLatitude}{" "}
                                longitude {onePackage.to_locationLongitude}
                            </Typography>
                            <Typography variant="body2">
                                Package Details
                                <br />
                                Height: {onePackage.height}cm, weight:{" "}
                                {onePackage.weight}g, depth: {onePackage.depth}
                                cm, width: {onePackage.width}cm
                            </Typography>
                            <Typography mt={3} variant="body2">
                                Package Status: {onePackage.packageStatus}
                            </Typography>
                            <Typography mt={3} variant="body2">
                                Driver Email : {onePackage.driverEmail}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {user.userType === "client" ? (
                                <>
                                    <Button
                                        variant="outline-primary"
                                        onClick={goHome}
                                        size="large"
                                    >
                                        Home
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() =>
                                            handleEdit(onePackage._id)
                                        }
                                        size="small"
                                    >
                                        Edit Package
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() =>
                                            handleDelete(onePackage._id)
                                        }
                                    >
                                        Delete Package
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline-primary"
                                        onClick={goHome}
                                        size="large"
                                    >
                                        Home
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() =>
                                            handleDeliver(onePackage._id)
                                        }
                                        size="small"
                                    >
                                        Deliver Package
                                    </Button>
                                </>
                            )}
                        </CardActions>
                    </React.Fragment>
                </Col>
                <Col>
                    <div>
                        <MapComponent onePackage={onePackage} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
}

export default PackageDetails;

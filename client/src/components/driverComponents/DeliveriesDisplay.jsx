import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from 'react-toastify'
import {
    getDeliveries,
    deleteDelivery,
    reset,
} from "../../features/delivery/deliverySlice";
import SpinnerComponent from "../SpinnerComponent";

function DeliveriesDisplay({
    user,
    deliveries,
    isError,
    isLoading,
    isSuccess,
    message,
}) {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    function createData(
        packageid,
        packageDescription,
        start_time,
        pickup_time,
        end_time,
        status,
        delivery_details,
        deleteDelivery
    ) {
        return {
            packageid,
            packageDescription,
            start_time,
            pickup_time,
            end_time,
            status,
            delivery_details,
            deleteDelivery
        };
    }
    const [tableData, setTableData] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        dispatch(getDeliveries());
        setTableData(deliveries);
        return () => {
            dispatch(reset());
        };
    }, [user]);
    const handleDelete = async (id) => {
        if (window.confirm("are you sure you want to delete the package?")) {
            await dispatch(deleteDelivery(id));

            dispatch(getDeliveries());
            toast('delete successfull', {
                position: toast.POSITION.TOP_CENTER,
            })
        }
    };
    const handleEdit = (id) => {
        navigate(`/driverdashboard/edit/${id}`);
    };
    const handleDetails = (packageId) => {
        navigate(`/dashboard/view/${packageId}`);
    };
    const renderDeliveryStatus = (delivery) => {
        if (delivery === "Picked Up") {
            return (
                <Button style={{ width: "100px" }} variant="primary">
                    {delivery}
                </Button>
            );
        } else if (delivery === "failed") {
            return (
                <Button style={{ width: "100px" }} variant="danger">
                    {delivery}
                </Button>
            );
        } else if (delivery === "in transit") {
            return (
                <Button style={{ width: "100px" }} variant="secondary">
                    {delivery}
                </Button>
            );
        } else {
            return (
                <Button style={{ width: "100px" }} variant="success">
                    {delivery}
                </Button>
            );
        }
    };
    if (isLoading) {
        return <SpinnerComponent />;
    }
    return (
        <div className="display-table">
            <h2>My Deliveries</h2>
            <TableContainer component={Paper} style={{ width: 1050 }}>
                <Table
                    size="medium"
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>
                                package
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                package from
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Package To
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Package delivery time
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery Details
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Delivery Edit
                            </StyledTableCell>
                            <StyledTableCell width={5} align="right">
                                Delete Delivery
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.length > 0 ? (
                            deliveries.map((delivery, i) => (
                                <StyledTableRow key={delivery._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {delivery.packageDescription}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {delivery.packageFrom}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {delivery.packageTo}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {new Date(delivery.end_time).toLocaleDateString()}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {renderDeliveryStatus(delivery.status)}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleDetails(delivery._id)
                                            }
                                            variant="outline-primary"
                                        >
                                            details
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() => handleEdit(delivery._id)}
                                            variant="outline-secondary"
                                        >
                                            <i
                                                className="fa fa-edit"
                                                aria-hidden="true"
                                            ></i>
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleDelete(delivery._id)
                                            }
                                            variant="outline-danger"
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            ></i>
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <div>
                                <h3>You have no deliveries set yet</h3>
                            </div>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DeliveriesDisplay;
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
import { toast } from "react-toastify";

import SpinnerComponent from "../SpinnerComponent";
import { getAllDeliveries, reset } from "../../features/delivery/deliverySlice";

function AllDeliveriesDisplay({
    user,
    allPackages,
    allDeliveries,
    isSuccess,
    isError,
    message,
    isLoading,
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
        packageDescription,
        packageFrom,
        packageTo,
        packageCreator,
        packageDetails
    ) {
        return {
            packageDescription,
            packageFrom,
            packageTo,
            packageCreator,
            packageDetails,
        };
    }
    const [tableData, setTableData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getAllDeliveries());
        return () => {
            dispatch(reset());
        };
    }, []);
    const handleDetails = (deliveryId) => {
        navigate(`/dashboard/view/${deliveryId}`);
    };
    const renderPackageStatus = (status) => {
        if (status === "open") {
            return (
                <Button style={{ width: "100px" }} variant="primary">
                    {status}
                </Button>
            );
        } else if (status === "failed") {
            return (
                <Button style={{ width: "100px" }} variant="danger">
                    {status}
                </Button>
            );
        } else if (status === "in transit") {
            return (
                <Button style={{ width: "100px" }} variant="secondary">
                    {status}
                </Button>
            );
        } else {
            return (
                <Button style={{ width: "100px" }} variant="success">
                    {status}
                </Button>
            );
        }
    };
    const checkDriver = (driver) => {
        try {
            const packageToDeliver = allPackages.filter(pack => pack._id === driver)
            if(packageToDeliver) {
                console.log(packageToDeliver)
            }
            
        } catch (error) {
            
        }

    }

    if (isLoading) {
        return <SpinnerComponent />;
    }
    return (
        <div className="display-table">
            <TableContainer component={Paper} style={{ width: 1050 }}>
                <Table
                    size="medium"
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Delivery for</StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery From
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery To
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery Start_time
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Delivery End_time
                            </StyledTableCell>
                            <StyledTableCell align="center">
                            Driver Delivering
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                More Details
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allDeliveries.length > 0 ? (
                            allDeliveries.map((delivery, i) => (
                                <StyledTableRow key={delivery._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {delivery.packageDescription}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {renderPackageStatus(delivery.status)}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {delivery.packageFrom}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {delivery.packageTo}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {new Date(
                                            delivery.start_time
                                        ).toLocaleDateString()}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {new Date(
                                            delivery.end_time
                                        ).toLocaleDateString()}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {delivery.userEmail}
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
                                </StyledTableRow>
                            ))
                        ) : (
                            <div>
                                <h3>There are no deliveries to display</h3>
                            </div>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AllDeliveriesDisplay;

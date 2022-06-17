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
import {
    getPackages,
    deletePackage,
    reset,
} from "../../features/packages/packageSlice";
import SpinnerComponent from "../SpinnerComponent";

function PackageDisplay({
    user,
    packages,
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
        packageFrom,
        packageTo,
        packageStatus,
        packageDetails,
        deletePackage
    ) {
        return {
            packageid,
            packageDescription,
            packageFrom,
            packageTo,
            packageStatus,
            packageDetails,
            deletePackage,
        };
    }
    const [tableData, setTableData] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        if (!user) {
            navigate("/login");
        }
        dispatch(getPackages());
        setTableData(packages);
        return () => {
            dispatch(reset());
        };
    }, [user]);
    const handleDelete = async (id) => {
        if (window.confirm("are you sure you want to delete the package?")) {
            await dispatch(deletePackage(id));

            dispatch(getPackages());
        }
    };
    const handleEdit = (id) => {
        navigate(`/dashboard/edit/${id}`);
    };
    const handleDetails = (packageId) => {
        navigate(`/dashboard/view/${packageId}`);
    };
    const renderPackageStatus = (pack) => {
        if (pack.packageStatus === "open") {
            return (
                <Button style={{ width: "100px" }} variant="primary">
                    {pack.packageStatus}
                </Button>
            );
        } else if (pack.packageStatus === "failed") {
            return (
                <Button style={{ width: "100px" }} variant="danger">
                    {pack.packageStatus}
                </Button>
            );
        } else if (pack.packageStatus === "intransit") {
            return (
                <Button style={{ width: "100px" }} variant="secondary">
                    {pack.packageStatus}
                </Button>
            );
        } else {
            return (
                <Button style={{ width: "100px" }} variant="success">
                    {pack.packageStatus}
                </Button>
            );
        }
    };
    if (isLoading) {
        return <SpinnerComponent />;
    }
    return (
        <div className="display-table">
            <h2>My Packages</h2>
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
                                Package description
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Sender
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Package To
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Package Id
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Package Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                package details
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                package edit
                            </StyledTableCell>
                            <StyledTableCell width={5} align="right">
                                package delete
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.length > 0 ? (
                            packages.map((pack, i) => (
                                <StyledTableRow key={pack._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {pack.description}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack.from_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack.to_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack._id}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {renderPackageStatus(pack)}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleDetails(pack._id)
                                            }
                                            variant="outline-primary"
                                        >
                                            details
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() => handleEdit(pack._id)}
                                            variant="outline-secondary"
                                        >
                                            <i
                                                class="fa fa-edit"
                                                aria-hidden="true"
                                            ></i>
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleDelete(pack._id)
                                            }
                                            variant="outline-danger"
                                        >
                                            <i
                                                class="fa fa-trash"
                                                aria-hidden="true"
                                            ></i>
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <div>
                                <h3>You have no packages yet</h3>
                            </div>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PackageDisplay;

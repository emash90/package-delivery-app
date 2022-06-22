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
import { getAllPackages, reset } from "../../features/packages/packageSlice";
import SpinnerComponent from "../SpinnerComponent";
import { getAllUsers } from "../../features/auth/authSlice";

function AllUsersDisplay({
    user,
    allUsers,
    allPackages,
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
        if (isError) {
            console.log(message);
        }
        dispatch(getAllUsers());
        return () => {
            dispatch(reset());
        };
    }, []);
    const handleDetails = (packageId) => {
        navigate(`/dashboard/view/${packageId}`);
    };

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
                            <StyledTableCell>User FirstName</StyledTableCell>
                            <StyledTableCell align="center">
                                User LastName
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                User Email
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                User Type
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Account Created on
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                More details
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers.length > 0 ? (
                            allUsers.map((user, i) => (
                                <StyledTableRow key={user._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {user.firstName}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {user.lastName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {user.email}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {user.accountType}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            onClick={() =>
                                                handleDetails(user._id)
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
                                <h3>There are 0 users</h3>
                            </div>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AllUsersDisplay;

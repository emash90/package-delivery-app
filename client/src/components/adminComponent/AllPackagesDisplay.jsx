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
    getAllPackages,
    reset,
} from "../../features/packages/packageSlice";
import SpinnerComponent from "../SpinnerComponent";

function AllPackagesDisplay({
    user, allPackages, isSuccess, isError, message, isLoading
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
        dispatch(getAllPackages());
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
                            <StyledTableCell>
                                Package Description
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                From
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                To
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Package Creator
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                More Details
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allPackages.length > 0 ? (
                            allPackages.map((pack, i) => (
                                <StyledTableRow key={pack._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {pack.description}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack.from_address}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack.to_address}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {pack.packageCreator}
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

export default AllPackagesDisplay;
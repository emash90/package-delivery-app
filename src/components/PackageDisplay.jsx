import { Button } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function PackageDisplay() {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
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
    const packages = [
        {
            packageDescription: "shirt",
            packageFrom: "edwin",
            packageTo: "pam",
            packageStatus: "open",
            packageid: 1,
        },
        {
            packageDescription: "shirt",
            packageFrom: "edwin",
            packageTo: "pam",
            packageStatus: "intransit",
            packageid: 2,
        },
        {
            packageDescription: "shirt",
            packageFrom: "edwin",
            packageTo: "pam",
            packageStatus: "failed",
            packageid: 3,
        },
        {
            packageDescription: "shirt",
            packageFrom: "edwin",
            packageTo: "pam",
            packageStatus: "open",
            packageid: 4,
        },
        {
            packageDescription: "shirt",
            packageFrom: "edwin",
            packageTo: "pam",
            packageStatus: "delivered",
            packageid: 5,
        },
    ];
    const renderPackageStatus = (pack) => {
        if (pack.packageStatus === "open") {
            return <Button style={{width: '100px'}} variant="primary">{pack.packageStatus}</Button>;
        } else if (pack.packageStatus === "failed") {
            return <Button style={{width: '100px'}}  variant="danger">{pack.packageStatus}</Button>;
        } else if (pack.packageStatus === "intransit") {
            return <Button style={{width: '100px'}}  variant="secondary">{pack.packageStatus}</Button>;
        } else {
            return <Button style={{width: '100px'}}  variant="success">{pack.packageStatus}</Button>;
        }
    };

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
                            <StyledTableCell align="right">
                                Package Status
                            </StyledTableCell>
                            <StyledTableCell align="right">
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
                        {packages.map((pack) => (
                            <StyledTableRow key={pack.packageid}>
                                <StyledTableCell component="th" scope="row">
                                    {pack.packageid}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {pack.packageDescription}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {pack.packageFrom}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {pack.packageTo}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {renderPackageStatus(pack)}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button variant="outline-primary">
                                        details
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button variant="outline-secondary">
                                        <i
                                            class="fa fa-edit"
                                            aria-hidden="true"
                                        ></i>
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button variant="outline-danger">
                                        <i
                                            class="fa fa-trash"
                                            aria-hidden="true"
                                        ></i>
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PackageDisplay;

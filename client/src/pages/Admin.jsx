import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import SideNavigation from "../components/clientComponents/SideNavigation";
import AllPackagesDisplay from "../components/adminComponent/AllPackagesDisplay";
import AllUsersDisplay from "../components/adminComponent/AllUsersDisplay";
import Pagination from "../components/clientComponents/Pagination";
import AllDeliveriesDisplay from "../components/adminComponent/AllDeliveriesDisplay";

function Admin({
    message,
    user,
    allUsers,
    isError,
    isLoading,
    isSuccess,
    allPackages,
    onePackage,
    allDeliveries,
    oneDelivery,
}) {
    const [myPackages, setMyPackages] = useState([]);
    const [myPackagesPerPage, setMyPackagesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastPackage = currentPage * myPackagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - myPackagesPerPage;
    const currentPackage = allPackages.slice(
        indexOfFirstPackage,
        indexOfLastPackage
    );
    const currentDeliveries = allDeliveries.slice(
        indexOfFirstPackage,
        indexOfLastPackage
    );
    const currentUsers = allUsers.slice(
        indexOfFirstPackage,
        indexOfLastPackage
    );

    const openPackages = allPackages.filter(
        (pack) => pack.packageStatus === "open"
    );
    const packagesInTransit = allPackages.filter(
        (pack) => pack.packageStatus === "intransit"
    );
    const deliveredPackages = allPackages.filter(
        (pack) => pack.packageStatus === "delivered"
    );
    const failedPackages = allPackages.filter(
        (pack) => pack.packageStatus === "failed"
    );
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="dashboard">
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <SideNavigation />
                    </Col>
                    <Col md={10}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <div className="package-summary-container">
                                            <Row>
                                                <Col>
                                                    <h3>
                                                        Total Packages:{" "}
                                                        {allPackages.length}
                                                    </h3>
                                                </Col>
                                                <Col>
                                                    <h6>
                                                        Open Packages:{" "}
                                                        {openPackages.length}
                                                    </h6>
                                                    <h6>
                                                        Packages in transit:{" "}
                                                        {
                                                            packagesInTransit.length
                                                        }
                                                    </h6>
                                                </Col>
                                                <Col>
                                                    <h6>
                                                        Delivered Packages:{" "}
                                                        {
                                                            packagesInTransit.length
                                                        }
                                                    </h6>
                                                    <h6 className="failed-status">
                                                        Failed Packages:{" "}
                                                        {failedPackages.length}
                                                    </h6>
                                                </Col>
                                            </Row>
                                        </div>
                                        <AllPackagesDisplay
                                            message={message}
                                            user={user}
                                            isError={isError}
                                            isLoading={isLoading}
                                            isSuccess={isSuccess}
                                            allPackages={currentPackage}
                                            onePackage={onePackage}
                                        />
                                        <Pagination
                                            myPackagesPerPage={
                                                myPackagesPerPage
                                            }
                                            totalPackages={allPackages.length}
                                            paginate={paginate}
                                        />
                                    </>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <>
                                    <AllUsersDisplay
                                        message={message}
                                        user={user}
                                        allUsers={currentUsers}
                                        isError={isError}
                                        isLoading={isLoading}
                                        isSuccess={isSuccess}
                                    />
                                    <Pagination
                                    myPackagesPerPage={
                                        myPackagesPerPage
                                    }
                                    totalPackages={allUsers.length}
                                    paginate={paginate}
                                />
                                </>
                                }
                            />
                            <Route
                                path="/deliveries"
                                element={
                                    <>
                                    <AllDeliveriesDisplay
                                        allDeliveries={currentDeliveries}
                                        oneDelivery={oneDelivery}
                                        message={message}
                                        user={user}
                                        isError={isError}
                                        isLoading={isLoading}
                                        isSuccess={isSuccess}
                                    />
                                    <Pagination
                                    myPackagesPerPage={
                                        myPackagesPerPage
                                    }
                                    totalPackages={allDeliveries.length}
                                    paginate={paginate}
                                />
                                </>
                                }
                            />
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Admin;

import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import SideNavigation from "../components/clientComponents/SideNavigation";
import OverView from "../components/adminComponent/OverView";
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
                                    <OverView />
                                }
                            />
                            <Route
                                path="/packages"
                                element={
                                    <>
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
                                            allPackages={allPackages}
                                            allDeliveries={currentDeliveries}
                                            oneDelivery={oneDelivery}
                                            message={message}
                                            user={user}
                                            allUsers={allUsers}
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

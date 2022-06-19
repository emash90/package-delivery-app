import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import SideNavigation from "../components/clientComponents/SideNavigation";
import Pagination from "../components/clientComponents/Pagination";
import DeliveriesDisplay from "../components/driverComponents/DeliveriesDisplay";
import PackageDetails from "../components/clientComponents/PackageDetails";
import DeliveryForm from '../components/driverComponents/DeliveryForm'
import AvailablePackages from '../components/driverComponents/AvailablePackages'

function DriverDashboard({ user, allPackages, onePackage, deliveries, isError, isSuccess, message, isLoading }) {

   //paginating the packages
   const [myPackages, setMyPackages] = useState([])
   const [myPackagesPerPage, setMyPackagesPerPage] = useState(8)
   const [currentPage, setCurrentPage] = useState(1)
   const indexOfLastPackage = currentPage * myPackagesPerPage
   const indexOfFirstPackage = indexOfLastPackage - myPackagesPerPage
   const currentPackage = allPackages.slice(indexOfFirstPackage, indexOfLastPackage)
  

   const paginate = (pageNumber) => {
     setCurrentPage(pageNumber)
   }

    return (
        <div className="dashboard">
            <Container fluid>
                <Row>
                    <Col  md={2}>
                        <div className="sidebar">
                            <SideNavigation />
                        </div>
                    </Col>
                    <Col>
                        <Routes>
                            <Route path="/" element={
                                <>
                                <AvailablePackages allPackages={currentPackage}/>
                                <Pagination myPackagesPerPage={myPackagesPerPage} totalPackages={allPackages.length} paginate={paginate}/>
                                </>
                            } />
                            <Route
                                path="/createdelivery/:id"
                                element={<DeliveryForm onePackage={onePackage} />}
                            />
                            <Route
                                path="/mydeliveries"
                                element={<DeliveriesDisplay deliveries={deliveries} />}
                            />
                            <Route path="/view/:id" element={<PackageDetails />} />

                        </Routes>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default DriverDashboard;

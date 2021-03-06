import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import PackageCreate from "../components/clientComponents/PackageCreate";

import PackageDisplay from "../components/clientComponents/PackageDisplay";
import SideNavigation from "../components/clientComponents/SideNavigation";
import Pagination from "../components/clientComponents/Pagination";
import PackageDetails from "../components/clientComponents/PackageDetails";
import PackageEdit from "../components/clientComponents/PackageEdit"

function Dashboard({ user, packages, isError, isSuccess, message, isLoading }) {

   //paginating the packages
   const [myPackages, setMyPackages] = useState([])
   const [myPackagesPerPage, setMyPackagesPerPage] = useState(10)
   const [currentPage, setCurrentPage] = useState(1)
   const [currentLocation, setCurrentLocation] = useState({lat: '', long: ''})
   const indexOfLastPackage = currentPage * myPackagesPerPage
   const indexOfFirstPackage = indexOfLastPackage - myPackagesPerPage
   const currentPackage = packages.slice(indexOfFirstPackage, indexOfLastPackage)
  useEffect(()=> { 
   navigator.geolocation.getCurrentPosition((position) => {
    setCurrentLocation({lat: position.coords.latitude, long: position.coords.longitude});
  });
},[])

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
                                <PackageDisplay isSuccess={isSuccess} isLoading={isLoading} message={message} isError={isError} user={user} packages={currentPackage}/>
                                <Pagination myPackagesPerPage={myPackagesPerPage} totalPackages={packages.length} paginate={paginate}/>
                                </>
                            } />
                            <Route
                                path="/createpackage"
                                element={<PackageCreate currentLocation={currentLocation} />}
                            />
                            <Route path="/view/:id" element={<PackageDetails user={user} />} />
                            <Route path="/edit/:id" element={<PackageEdit />} />

                        </Routes>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;

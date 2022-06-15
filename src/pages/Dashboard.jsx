import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import PackageCreate from "../components/PackageCreate";

import PackageDisplay from "../components/PackageDisplay";
import SideNavigation from "../components/SideNavigation";

function Dashboard() {
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
                            <Route path="/" element={<PackageDisplay />} />
                            <Route
                                path="/createpackage"
                                element={<PackageCreate />}
                            />
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;

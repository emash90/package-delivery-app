import React from "react";
import { Nav, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

function SideNavigation() {
    const { user } = useSelector((state) => state.auth);
    const selectSideNavContent = () => {
        if (user.userType === "client") {
            return (
                <Nav>
                    <LinkContainer to={"/dashboard"} style={{ color: "black" }}>
                        <Nav.Link>my packages</Nav.Link>
                    </LinkContainer>

                    <LinkContainer
                        to={"/dashboard/createpackage"}
                        style={{ color: "black" }}
                    >
                        <Nav.Link>create package</Nav.Link>
                    </LinkContainer>
                </Nav>
            );
        } else if (user.userType === "driver") {
            return (
                <Nav>
                    <LinkContainer
                        to={"/driverdashboard"}
                        style={{ color: "black" }}
                    >
                        <Nav.Link>Available packages</Nav.Link>
                    </LinkContainer>

                    <LinkContainer
                        to={"/driverdashboard/mydeliveries"}
                        style={{ color: "black" }}
                    >
                        <Nav.Link>My Deliveries</Nav.Link>
                    </LinkContainer>
                </Nav>
            );
        } else {
            return (
                <Nav>
                    <LinkContainer to={"/admin"} style={{ color: "black", borderBottom: 'solid 1px grey'}}>
                        <Nav.Link>Over View</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={"/admin/packages"} style={{ color: "black" }}>
                        <Nav.Link>All Packages</Nav.Link>
                    </LinkContainer>

                    <LinkContainer
                        to={"/admin/deliveries"}
                        style={{ color: "black" }}
                    >
                        <Nav.Link>All Deliveries</Nav.Link>
                    </LinkContainer>

                    <LinkContainer
                        to={"/admin/users"}
                        style={{ color: "black" }}
                    >
                        <Nav.Link>All Users</Nav.Link>
                    </LinkContainer>
                </Nav>
            );
        }
    };
    return <div className="sidebar">{selectSideNavContent()}</div>;
}

export default SideNavigation;

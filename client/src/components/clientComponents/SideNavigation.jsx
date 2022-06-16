import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function SideNavigation() {
    return (
        <div className="sidebar">
            <Nav>
                <LinkContainer to={"/dashboard"} style={{color: 'black'}}>
                    <Nav.Link >my packages</Nav.Link>
                </LinkContainer>

                <LinkContainer to={"/dashboard/createpackage"} style={{color: 'black'}}>
                    <Nav.Link>create package</Nav.Link>
                </LinkContainer>

            </Nav>
        </div>
    );
}

export default SideNavigation;

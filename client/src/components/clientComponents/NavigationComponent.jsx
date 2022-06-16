import React from "react";
import { NavDropdown, Button, Nav, Navbar, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../features/auth/authSlice";

function NavigationComponent({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
        toast("logged out!");
    };
    return (
        <div>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <LinkContainer to={"/"}>
                        <Navbar.Brand>Package Tracker</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {!user ? (
                                <>
                                    <LinkContainer to={"/login"}>
                                        <Nav.Link>
                                            <i
                                                className="fa fa-sign-in"
                                                aria-hidden="true"
                                                style={{ marginRight: "5px" }}
                                            ></i>
                                            Login
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to={"/register"}>
                                        <Nav.Link>
                                            <i
                                                className="fa fa-user-plus"
                                                aria-hidden="true"
                                            ></i>
                                            Register
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            ) : (
                                <NavDropdown
                                    title={user ? user.name : ""}
                                    id="basic-nav-dropdown"
                                >
                                    <NavDropdown.Item href="#action/3.1">
                                        Action
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">
                                        Something
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item>
                                        <Button
                                            onClick={handleLogout}
                                            variant="danger"
                                        >
                                            <i
                                                className="fa fa-sign-out"
                                                aria-hidden="true"
                                                style={{ marginRight: "10px" }}
                                            ></i>
                                            Logout
                                        </Button>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavigationComponent;

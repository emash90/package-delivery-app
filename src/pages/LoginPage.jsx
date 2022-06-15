import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'

function LoginPage() {
    return (
        <div className="login-form">
            <section className="heading">
                <h3>
                <i className="fa fa-sign-in" aria-hidden="true" style={{marginRight: '5px'}}></i>
                    Login
                </h3>
            </section>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <div className="form-group">
                    <p>
                        No account? <Link to={'/register'} >Register</Link>
                    </p>
                </div>
            </Form>
        </div>
    );
}

export default LoginPage;

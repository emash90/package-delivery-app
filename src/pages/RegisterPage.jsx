import { useState } from "react";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@mui/material";
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function RegisterPage() {
    const [value, setValue] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        accountType: "",
        email: "",
        password: "",
        password2: "",
    });
    const { firstName, lastName, accountType, email, password, password2 } =
        formData;
    const handleClick = (event) => {
        setValue(event.target.value);
    };
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        console.log('clicked register button');
    };
    return (
    <div className="register-form mb-3">
        <section className="heading">
            <h3>
                <i className="fa fa-user-plus" aria-hidden="true"></i>
                Register
            </h3>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group  mb-3">
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        placeholder="Enter your first name"
                        onChange={onChange}
                    />
                </div>
                <div className="form-group  mb-3">
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        placeholder="Enter your last name"
                        onChange={onChange}
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        value={email}
                        placeholder="Enter your email address"
                        onChange={onChange}
                    />
                </div>
                <div className="form-group  mb-3">
                    <input
                        type="text"
                        name="password"
                        className="form-control"
                        id="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={onChange}
                    />
                </div>
                <div className="form-group  mb-3">
                    <input
                        type="text"
                        name="password2"
                        className="form-control"
                        id="password2"
                        value={password2}
                        placeholder="Confirm password"
                        onChange={onChange}
                    />
                </div>
                <div>
                    <FormControl>
                        <FormLabel id="accountType">Register as</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="accountType"
                            name="accountType"
                            value={value}
                            onClick={handleClick}
                            onChange={onChange}
                        >
                            <FormControlLabel
                                value="client"
                                control={<Radio />}
                                label="client"
                            />
                            <FormControlLabel
                                value="driver"
                                control={<Radio />}
                                label="driver"
                            />
                            <FormControlLabel
                                value="admin"
                                control={<Radio />}
                                label="admin"
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="form-group">
                    <Button type="submit" className="btn btn-block">
                        Register
                    </Button>
                </div>
                <div className="form-group">
                    <p>
                        Already have an account? <Link to={'/login'} >Login</Link>
                    </p>
                </div>
            </form>
        </section>
    </div>
    )
}

export default RegisterPage;

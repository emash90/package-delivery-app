import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../../src/features/auth/authSlice'

import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@mui/material";
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SpinnerComponent from "../components/SpinnerComponent";

function RegisterPage({ user, packages }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isError, message, isSuccess, isLoading } = useSelector((state) => state.auth);
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
        if (password !== password2) {
            toast.error("passwords do not match");
        } else if (password.length < 6) {
            toast("ensure password is more than 6 characters");
        } else if (!firstName || !lastName || !email || !password) {
            toast.error("Please ensure all fields are filled");
        } else if (accountType == "") {
            toast.error("please select either 'client', 'driver' or 'admin'");
        } else {
            const userData = {
                firstName,
                lastName,
                accountType,
                email,
                password,
            };
            dispatch(register(userData));
            console.log(userData);
        }
    };
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast(`hey ${user.name} you are now registered`);
            navigate("/login");
        }
        dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);
    if(isLoading) {
        return <SpinnerComponent />
    }
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

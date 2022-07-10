import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice";
import SpinnerComponent from "../components/SpinnerComponent";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, userType, isLoading, isError, isSuccess, message } =
        useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message, {
                position: toast.POSITION.TOP_CENTER
            });
        }

        if (isSuccess) {
            if (user.userType === "client") {
                navigate("/dashboard");
                toast(`welcome ${user.name}`, {
                    position: toast.POSITION.TOP_CENTER
                });
            } else if(user.userType === 'driver') {
                toast("welcome driver", {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/driverdashboard");
            } else {
                toast("welcome admin", {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/admin");
            }
        }

        dispatch(reset());
    }, [user, userType, isSuccess, message, navigate, dispatch]);
    if(isLoading){
        return <SpinnerComponent />
    }
    return (
        <div className="login-form">
            <section className="heading">
                <h3>
                    <i
                        className="fa fa-sign-in"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                    ></i>
                    Login
                </h3>
            </section>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" onChange={onChange} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={onChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <div className="form-group">
                    <p>
                        No account? <Link to={"/register"}>Register</Link>
                    </p>
                </div>
            </Form>
        </div>
    );
}

export default LoginPage;

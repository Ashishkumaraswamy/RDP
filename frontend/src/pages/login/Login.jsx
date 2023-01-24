import React, { useContext, useState } from 'react'
import "./Login.scss";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';

const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [err, setErr] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const inputChange = (e) => {
        e.preventDefault()
        setUser(prevValue => {
            return {
                ...prevValue,
                [e.target.name]: e.target.value
            }
        })
        console.log(user);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(user);
            setTimeout(() => {
                console.log("Tried Navigating")
                navigate("/")
            }, 2000)
        } catch (err) {
            setErr(err.response.data);
        }
    };


    return (
        <div className="login">
            <ToastContainer />
            <div className="card">
                <div className="left">
                    <h1>Recruitment Data Platform!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
                    <span>Don't have an account?</span>
                    <Link to="/register"><button>Register</button></Link>
                </div>
                <div className="right">
                    <h1>LOG IN</h1>
                    <form>
                        <input type="text" name="username" placeholder='Username' required onChange={inputChange} />
                        <input type="password" name="password" placeholder='Password' required onChange={inputChange} />
                        {err && err}
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
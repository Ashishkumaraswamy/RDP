import React from 'react'
import { useState } from 'react';
import "./Register.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {

    const navigate = useNavigate();

    const inputChange = (e) => {
        e.preventDefault()
        setNewuser(prevValue => {
            return {
                ...prevValue,
                [e.target.name]: e.target.value
            }
        })
        console.log(newUser);
    }

    const checkEmpty = () => {
        return (newUser.username && newUser.password && newUser.emailAddress && newUser.confirmPassword);
    }

    const checkPasswords = () => {
        return (newUser.password == newUser.confirmPassword);
    }

    const submitForm = (e) => {
        e.preventDefault();
        const check = checkEmpty();
        if (check) {
            const checkPassword = checkPasswords();
            if (checkPassword) {
                const headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                };
                axios.post('http://127.0.0.1:8800/register', {
                    username: newUser.username,
                    password: newUser.password,
                    emailId: newUser.emailAddress
                },
                    { headers }
                )
                    .then(response => {
                        console.log(response.data);
                        toast(response.data);
                        setTimeout(() => {
                            navigate("/login");
                        }, 5000);

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            else {
                console.log("here");
                setError("Passwords do not match. Please check passwords!")
            }
        }
    }

    const [newUser, setNewuser] = useState({
        username: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    return (
        <div className="register">
            <ToastContainer />
            <div className="card">
                <div className="left">
                    <h1>Recruitment Data Platform!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
                    <span>Already have an account?</span>
                    <Link to="/login" replace={true}><button>Login</button></Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    {error && <p className="errorMessage">{error}</p>}
                    <form>
                        <input type="text" name="username" placeholder='Username' onChange={inputChange} required autoComplete='off' />
                        <input type="email" name="emailAddress" placeholder='Email Address' onChange={inputChange} required autoComplete='off' />
                        <input type="password" name="password" placeholder='Password' onChange={inputChange} required />
                        <input type="password" name="confirmPassword" placeholder='Confirm Password' onChange={inputChange} required autoComplete='off' />
                        <button onClick={submitForm}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
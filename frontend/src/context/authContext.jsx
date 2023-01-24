import axios from "axios";
import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login = async (inputs) => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'withCredentials': true
        };
        console.log(inputs);
        const res = await axios.post("http://127.0.0.1:8800/login", inputs, { headers })
        setCurrentUser(res.data);

    }

    const logout = () => {
        if (window.localStorage.getItem("user") !== null) {
            window.localStorage.removeItem("user");
            setCurrentUser(null);
        }
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
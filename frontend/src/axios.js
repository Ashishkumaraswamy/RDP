import axios from "axios";
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};
export const makerequest = axios.create({
    baseURL: "http://127.0.0.1:8800",
    headers: headers
});
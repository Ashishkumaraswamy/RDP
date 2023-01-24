import React from 'react'
import "./AddJob.scss";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makerequest } from '../../axios';

const AddJob = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        jobTitle: "",
        jobDescription: "",
        postedBy: "",
        salary: "",
        lastDateToApply: "",
    });

    const [error, setError] = useState(null);

    const handleInputs = (e) => {
        setInputs(prevVal => {
            return { ...prevVal, [e.target.name]: e.target.value }
        })
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);
        try {
            const resp = makerequest.post("/jobs/add", inputs)
            console.log(resp.data)
            navigate("/");
        } catch (error) {
            setError(error);
        }

    }

    return (
        <div className="addpage">
            <form >
                <div className="jobTitle">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input type="text" placeholder='Job Title' name='jobTitle' onChange={handleInputs} />
                </div>
                <div className="jobDescription">
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea name="jobDescription" id="" cols="30" rows="10" placeholder='Job Description' onChange={handleInputs}></textarea>
                </div>
                <div className="postedBy">
                    <label htmlFor="postedBy" >Posted By</label>
                    <input type="text" name='postedBy' placeholder='Posted By' onChange={handleInputs} />
                </div>
                <div className="salary">
                    <label htmlFor="salary">Salary</label>
                    <input type="number" name='salary' placeholder='Salary' onChange={handleInputs} />
                </div>
                <div className="dateToApply">
                    <label htmlFor="lastDateToApply">Last Date To Apply</label>
                    <input type="date" placeholder='Last Date To Apply' name='lastDateToApply' onChange={handleInputs} />
                </div>
                <div className="submitbtn">
                    <button onClick={handleSubmit}>Add Job</button>
                </div>
            </form>
        </div>
    )
}

export default AddJob
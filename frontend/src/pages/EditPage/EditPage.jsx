import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import "./EditPage.scss"

const EditPage = () => {
    const { jobid } = useParams();
    console.log(jobid);

    const job = {
        jobTitle: "SOFTWARE DEVELOPER",
        postedBy: "Ashish",
        isOpen: true,
        jobDescription: "Looking for a candidate for SOFTWARE DEVELOPER role",
        salary: 10000,
        lastDateToApply: "2023-10-22"
    }

    return (
        <div className="editpage">
            <form >
                <div className="jobTitle">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input type="text" value={job.jobTitle} />
                </div>
                <div className="jobDescription">
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea name="" id="" cols="30" rows="10" value={job.jobDescription}></textarea>
                </div>
                <div className="postedBy">
                    <label htmlFor="postedBy">Posted By</label>
                    <input type="text" value={job.postedBy} />
                </div>
                <div className="salary">
                    <label htmlFor="salary">Salary</label>
                    <input type="text" value={job.salary} />
                </div>
                <div className="dateToApply">
                    <label htmlFor="lastDateToApply">Last Date To Apply</label>
                    <input type="date" value={job.lastDateToApply} />
                </div>
                <div className="submitbtn">
                    <button>Update</button>
                </div>
            </form>
        </div>
    )
}

export default EditPage
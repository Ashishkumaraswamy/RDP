import React from 'react'
import JobCard from '../../components/JobCard/JobCard.jsx'
import NewJobCard from '../../components/NewJobCard/NewJobCard.jsx';
import "./Home.scss";
import { JobData } from '../../data/JobData.jsx';
import { useQuery } from 'react-query';
import { makerequest } from '../../axios.js';
import Job from '../job/Job.jsx';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/authContext.jsx';
import { useContext } from 'react';

const Home = () => {

    const { logout, currentUser } = useContext(AuthContext);

    console.log(currentUser);

    const { isLoading, error, data } = useQuery(["jobData"], () =>
        makerequest.get("/jobs").then((res) => {
            return res.data;
        })
    );

    console.log(isLoading, error, data);

    return (
        <div className="home">
            <div className="navbar">
                <div className="left">
                    <img src="https://t3.ftcdn.net/jpg/04/55/04/06/360_F_455040678_2KcTX3YY6hI48oFCDVOf4bHIfoslPvEO.jpg" alt="" />
                    <div className="title">
                        <p>Dream Job</p>
                    </div>
                </div>
                <div className="right">
                    <LogoutIcon className='logout' onClick={logout} />
                </div>
            </div>
            <h1>Hey {currentUser.username}!</h1>
            <p>Manage your openings and create a new one quickly!</p>
            <div className="joblistings">
                <NewJobCard />
                {error
                    ? "Something Went Wrong!"
                    : isLoading
                        ? "loading" :
                        !data ? "Loading" : data.map((job, idx) => {
                            console.log(data);
                            return <JobCard key={idx} jobTitle={job.jobTitle} jobDescription={job.jobDescription} jobId={job.jobId} />
                        })
                }
            </div>
        </div>
    )
}

export default Home
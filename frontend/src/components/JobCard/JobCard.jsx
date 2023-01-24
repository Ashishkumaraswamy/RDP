import React from 'react'
import "./JobCard.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { makerequest } from '../../axios';
import { useMutation, useQueryClient } from 'react-query';

const JobCard = ({ jobTitle, jobDescription, jobId }) => {

    const queryClient = useQueryClient();
    const mutation = useMutation(() => {
        const url = '/jobs/delete/' + jobId;
        return makerequest.delete(url);
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["jobData"]);
            },
        }
    );

    const handleDelete = (e) => {
        e.preventDefault();
        mutation.mutate();
    }

    return (
        <div className="jobcard">
            <DeleteIcon className='deleteIcon' onClick={handleDelete} />
            <div className="top">
            </div>
            <div className="bottom">
                <p className="jobRole">{jobTitle}</p>
                <span className="description">{jobDescription}</span>
                <div className="buttonGroup">
                    <button>View</button>
                    <Link to={`/edit/1`}><button>Edit</button></Link>
                </div>
            </div>
        </div>
    )
}

export default JobCard;
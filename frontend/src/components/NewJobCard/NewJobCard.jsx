import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import "./NewJobCard.scss";
import { Link } from 'react-router-dom';

const NewJobCard = () => {
    return (
        <div className="newjobcard">
            <AddIcon className='addIcon' />
            <div className="bottom">
                <p className="jobRole">New Opening</p>
                <span className="description">Lead Designer include research and analysis, overseeing a variety of design projects</span>
                <div className="buttonGroup">
                    <Link to={"/add"}><button>Create New</button></Link>
                </div>
            </div>
        </div>
    )
}

export default NewJobCard
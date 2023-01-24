import React, { useContext } from 'react'
import "./Navbar.scss";
import { AuthContext } from '../../context/authContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {

    const { logout } = useContext(AuthContext);
    return (
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
    )
}

export default Navbar
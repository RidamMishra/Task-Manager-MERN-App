import React from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header(){
    const [userInfo,setUserInfo] =useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/profile',{withCredentials: true})
        .then((res)=>{
            setUserInfo(res.data);
        })
    }, [])

    function logout(){
        axios.post('http://localhost:3001/logout',{withCredentials: true});
        navigate('/');
    }

    return(
        <div className="header">
            <div className='user-info'><span className='user-name'>HI {userInfo.uname}!</span><br /><span className='user-email'>{userInfo.email}</span></div>
            <div className='logout-button-div'>
                <button onClick={logout} className='logout-button'>Logout</button>
            </div>
        </div>
    )
}
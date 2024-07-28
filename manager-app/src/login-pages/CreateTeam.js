import React from 'react';
import Header from './Header';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CreateTeam() {
    const [newTeam,setNewTeam] = useState('');
    const [delTeam,setDelTeam] = useState('');
    const [option,setOption] = useState(true);
    const [createErr,setCreateErr] = useState('');
    const [delErr,setDelErr] = useState('');

    function handleNew(){
        if(newTeam===''){
            setCreateErr('Please enter team name');
        }
        else{
            axios.post('http://localhost:3001/create',{newTeam},{withCredentials: true})
            .then((result)=>{
                setCreateErr(result.data);
            });
        }
        setNewTeam('');
    }

    function handleDel(){
        if(delTeam===''){
            setDelErr('Please enter team name');
        }
        else{
            axios.post('http://localhost:3001/delete',{delTeam},{withCredentials: true})
            .then((result)=>{
                setDelErr(result.data);
            });
        }
        setDelTeam('');
    }

    return(
        <div className='main-div-container'>
            <Header />

            <div className='create-delete-grid'>
                <div onClick={()=>{setOption(true);setDelErr('');}} style={option ? {color:'black'}:{color:'grey'}} className='create-opt'>Create Team</div>
                <div onClick={()=>{setOption(false);setCreateErr('');}} style={option ? {color:'grey'}:{color:'black'}} className='create-opt'>Delete Team</div>
            </div>

            <div className='create-team' style={option ? {display:'block'}:{display:'none'}}>
                <br />
                <input type='text' value={newTeam} onChange={(event)=>{setNewTeam(event.target.value)}} className='input-box' placeholder='Enter team name'/>
                <br /><br />
                <button onClick={handleNew} className='login-signup-button'>Create new team</button>
                <br /><br />
                <div className='error-message'>{createErr}</div>
                <br />
            </div>

            <div className='del-team' style={option ? {display:'none'}:{display:'block'}}>
            <br />
                <input type='text' value={delTeam} onChange={(event)=>{setDelTeam(event.target.value)}} className='input-box' placeholder='Enter team name'/>
                <br /><br />
                <button onClick={handleDel} className='login-signup-button'>Delete team</button>
                <br /><br />
                <div className='error-message'>{delErr}</div>
                <br />
            </div>

            <Link to='/taskpage'>Go to Home</Link>
        </div>
    )
}
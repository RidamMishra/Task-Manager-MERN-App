import Header from './Header';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyTasks(){
    const [teams, setTeams] = useState([]);
    const [selTeam,setSelTeam] = useState('');
    const [err,setErr] = useState('');
    const [data,setData] = useState({});
    const [displayDiv,setDisplay] = useState('none');
    
    useEffect(() => {
        axios.get('http://localhost:3001/display')
        .then(result => {
            const teamNames = result.data.map(team => team.team);
            setTeams(teamNames.sort());
        })
    })

    function handleClick(){
        if(selTeam===''){
            setErr('Please select a team');
        }
        else{
            axios.post('http://localhost:3001/mytasks',{selTeam},{withCredentials:true})
            .then(result=>{
                if(result.data==='0'){
                    setErr('You do not belong to this team');
                }
                else{
                    setData(result.data);
                    setDisplay('block');
                    setErr('');
                }
            })
        }
    }

    function selectChange(event){
        setSelTeam(event.target.value);
        setErr('');
        setData({});
        setDisplay('none');
    }

    return(
        <div className='main-div-container'>
            <Header />
            <br />
            <select onChange={selectChange} className='input-box'>
                <option value=''>--Choose Team--</option>
                {teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                ))}
            </select>
            <br /><br />
            <button onClick={handleClick} className='login-signup-button'>Select Team</button>
            <br />
            <br />
            <div className='error-message'>{err}</div>
            <br />

            <div style={{display:displayDiv,border:'2px solid grey',padding:'10px',fontSize:'20px',textAlign:'left'}}>
                <p><b>Team name:</b> {data.team}</p>
                <p><b>Your assignment:</b> {data.ass}</p>
                <p><b>Completion status:</b> {data.status ? 'Completed':'Not Completed'}</p>
            </div>


        </div>
    )
}
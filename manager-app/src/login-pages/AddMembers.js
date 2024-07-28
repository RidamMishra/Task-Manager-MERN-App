import Header from './Header';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AddMembers() {
    const [teams, setTeams] = useState([]);
    const [members,setMembers] = useState([]);
    const [selTeam, setSelTeam] = useState('');
    const [selMem,setSelMem] = useState('');
    const [err,setErr] = useState('');
    const [formDisplay,setFormDisplay] = useState('none');

    const [ass,setAss] = useState('');
    const [lead,setLead] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/display')
        .then(result => {
            const teamNames = result.data.map(team => team.team);
            setTeams(teamNames.sort());
        })

        axios.get('http://localhost:3001/displaymembers')
        .then(result => {
            const memberNames = result.data.map(mem => mem.uname);
            setMembers(memberNames.sort());
        })
    }, []);

    function handleClick(){
        if(selTeam===''){
            setErr('Please select a team');
        }
        else{
            axios.post('http://localhost:3001/addcheck',{selTeam},{withCredentials:true})
            .then(result=>{
                if(result.data==='0'){
                    setErr('You do not belong to this team');
                }
                else if(result.data==='1'){
                    setErr('Only team leads can add members');
                }
                else{
                    setErr('');
                    setFormDisplay('block');
                }
            })
        }
    }

    function handleAdd(){
        if(selMem===''){
            setErr('Please select a member');
        }
        else{
            axios.post('http://localhost:3001/addmem',{selTeam,selMem,lead,ass})
            .then(result=>{
                setErr('');
                if(result.data==='0'){
                    alert('Member already part of team');
                }
                else{
                    alert('Member added succesfully');
                    setAss('');
                    setLead(false);
                }
            })
        }
    }

    function selectChange(event){
        setSelTeam(event.target.value);
        setErr('');
        setFormDisplay('none');
        setAss('');
        setLead(false);
        setSelMem('');
    }

    return (
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
            <div style={{display:formDisplay,border:'2px solid grey',padding:'10px'}}>

                <select onChange={(event)=>{setSelMem(event.target.value)}} className='input-box' value={selMem}>
                    <option value=''>--Choose Member--</option>
                    {members.map((mem, index) => (
                        <option key={index} value={mem}>{mem}</option>
                    ))}
                </select>
                <br />
                <br/>

                <textarea placeholder='Enter assignment or leave empty for now' onChange={(event)=>{setAss(event.target.value)}} rows='4' cols='27' value={ass}>
                </textarea>
                <br />

                <label style={lead ? {color:'black'}:{color:'grey'}}>
                    <input type='checkbox' onChange={()=>{setLead(!lead)}} checked={lead}/> Add as a co-lead
                </label>
                <br />
                <br />
                <button onClick={handleAdd} className='login-signup-button'>Add</button>
            </div>
            <br />
            <Link to='/taskpage'>Go to Home</Link>
        </div>
    );
}

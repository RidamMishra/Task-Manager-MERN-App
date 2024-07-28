import Header from './Header';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Update() {
    const [teams, setTeams] = useState([]);
    const [members,setMembers] = useState([]);
    const [selTeam, setSelTeam] = useState('');
    const [err,setErr] = useState('');
    const [formDisplay,setFormDisplay] = useState('none');

    const [selMem,setSelMem] = useState('Select Member');
    const [ass,setAss] = useState('');
    const [comp,setComp] = useState(false);
    const [lead,setLead] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/display')
        .then(result => {
            const teamNames = result.data.map(team => team.team);
            setTeams(teamNames.sort());
        })
    }, []);

    useEffect(()=>{
        for(let i=0;i<members.length;++i){
            if(members[i].member===selMem){
                setAss(members[i].assignment);
                setComp(members[i].complete);
                setLead(members[i].lead);
            }
        }
    },[selMem,members])

    function handleClick(){
        if(selTeam===''){
            setErr('Please select a team');
        }
        else{
            axios.post('http://localhost:3001/updatecheck',{selTeam},{withCredentials:true})
            .then(result=>{
                if(result.data==='0'){
                    setErr('You do not belong to this team');
                }
                else if(result.data==='1'){
                    setErr('Only team leads can update tasks');
                }
                else{
                    setErr('Click on any member to update their task or delete them from team');
                    setFormDisplay('block');
                    const memberNames = result.data.map(mem => ({member:mem.member,assignment:mem.assignment,complete:mem.complete,lead:mem.lead}));
                    setMembers(memberNames.sort((a,b)=>(a.member.localeCompare(b.member))));
                }
            });

        }
    }

    function selectChange(event){
        setSelTeam(event.target.value);
        setErr('');
        setFormDisplay('none');
        setAss('');
        setComp(false);
        setLead(false);
        setSelMem('Select Member');
    }

    function handleMemUpdate(mem){
        setSelMem(mem);
        setErr('Click on any member to update their task or delete them from team');
    }

    function handleUpdate(){
        if(selMem==='Select Member'){
            setErr('Please select a member');
        }
        else{
            axios.post('http://localhost:3001/update',{selTeam,selMem,ass,comp,lead})
            .then(result=>{
                setErr(result.data);
                axios.post('http://localhost:3001/updatecheck',{selTeam},{withCredentials:true})
                .then(res=>{
                    const memberNames = res.data.map(mem => ({member:mem.member,assignment:mem.assignment,complete:mem.complete,lead:mem.lead}));
                    setMembers(memberNames.sort((a,b)=>(a.member.localeCompare(b.member))));
                })
        })
        setAss('');
        setComp(false);
        setLead(false);
        setSelMem('Select Member');
        }
    }

    function handleDelete(){
        if(selMem==='Select Member'){
            setErr('Please select a member');
        }
        else{
            let confirm=prompt(`Type "yes" if you want to delete ${selMem} from ${selTeam}`);
            confirm.toLowerCase();
            if(confirm==='yes'){
                axios.post('http://localhost:3001/deletemem',{selTeam,selMem})
                .then(result=>{
                    setErr(result.data);
                    axios.post('http://localhost:3001/updatecheck',{selTeam},{withCredentials:true})
                    .then(res=>{
                        const memberNames = res.data.map(mem => ({member:mem.member,assignment:mem.assignment,complete:mem.complete,lead:mem.lead}));
                        setMembers(memberNames.sort((a,b)=>(a.member.localeCompare(b.member))));
                    })
                })
            }
        setAss('');
        setComp(false);
        setLead(false);
        setSelMem('Select Member');
        }
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
                <div className='update-input' style={selMem==='Select Member' ? {color:'grey',fontStyle:'italic'}:{}}>
                    <div>{selMem}</div>

                    <div>
                    <textarea placeholder='Leave empty for no task' value={ass} onChange={(event)=>{setAss(event.target.value)}} rows='4' cols='20'></textarea>
                    </div>
                    
                    <div>
                    <label>
                        <input type="checkbox" checked={comp} onChange={()=>{setComp(!comp)}}/>Task completed
                    </label>
                    </div>

                    <div>
                    <label>
                        <input type="checkbox" checked={lead} onChange={()=>{setLead(!lead)}}/>Lead
                    </label>
                    </div>
                </div>

                <br />
                
                <button className='login-signup-button' onClick={handleUpdate}>Update</button>
                <button className='login-signup-button' style={{backgroundColor:'red',marginLeft:'10px'}} onClick={handleDelete}>Delete from Team</button>

                <br /><br />

                <table>
                    <thead>
                    <tr border='1'>
                        <th>Name</th>
                        <th>Assignment</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map((mem,index)=>(
                        <tr key={index} onClick={()=>{handleMemUpdate(mem.member)}} className='data'>
                            <td style={mem.lead ? {fontWeight:'bold'}:{}}>{mem.member}</td>
                            <td>{mem.assignment}</td>
                            <td>{mem.complete ? 'Completed' : 'Not Completed'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <br />
            <Link to='/taskpage'>Go to Home</Link>
        </div>
    );
}
import { useState } from 'react';
import { Link,Navigate } from 'react-router-dom';
import axios from 'axios';

export default function Login(){
    const [password,setPass]=useState('');
    const [email,setEmail]=useState('');
    const [error,setError]=useState('');
    const [navigate,setNavigate] = useState(false);
    const [lead,setLead] = useState(false);

    function handleClick(){
        if(password===''||email===''){
            setError('Please fill all fields');
        }
        else{
            axios.post('http://localhost:3001/login',{email,password},{withCredentials: true})
            .then((result)=>{
                if(result.data==='0'){
                    setError('No account with given EmailID');
                }
                else if (result.data==='1'){
                    setError('Incorrect password');
                }
                else{
                    setNavigate(true);
                    setLead(result.data);
                }
            });
        }
    }

    if(navigate){
        return (
            <Navigate to={lead ? '/taskpage':'/taskpage/mytasks'}/>
        )
    }

    return(
        <div className='main-div-container'>
            <h1>Login</h1><br /><br />
            <input type="text" placeholder="Enter email id" onChange={(event)=>{setEmail(event.target.value)}} className='input-box'/><br /><br />
            <input type="password" placeholder="Enter password" onChange={(event)=>{setPass(event.target.value)}} className='input-box'/><br /><br />
            <p className='error-message'>{error}</p>
            <button onClick={handleClick} className='login-signup-button'>Login</button>
            <br /><br />
            <div>
                Don't have an account? <Link to="/signup">Create one!</Link>
            </div>
        </div>
    )
}
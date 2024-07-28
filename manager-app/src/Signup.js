import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup(){
    const [uname,setUname]=useState('');
    const [password,setPass]=useState('');
    const [email,setEmail]=useState('');
    const [role,setRole]=useState('');
    const [error,setError]=useState('');
    const [otp,setOtp]=useState('');
    const [verified,setVerified]=useState(false);
    const [generatedOTP,setgeneratedOTP] = useState(0);

    const navigate = useNavigate();

    function roleChange(event){
        setRole(event.target.value);
    }

    function handleClick(){
        if(uname===''||password===''||email===''||role===''){
            setError('Please fill all fields');
        }
        else if(!verified){
            setError('Email not verified');
        }
        else if(password.length<6){
            setError('Password must be at least 6 characters');
        }
        else{
            axios.post('https://task-manager-app-vert.vercel.app/signup',{uname,password,email,role})
            .then((result)=>{
                if(result.data==='0'){
                    setError('Account already exists with given EmailID')
                }
                else{
                    alert(result.data);
                    navigate('/login');
                }
            });
        }
    }

    function genOTP(){
        if(email===''){
            setError('Please enter your emailID');
        }
        else{
            axios.post('https://task-manager-app-vert.vercel.app/otp',{email})
            .then(result=>{
                alert('OTP sent to Email successfully');
                setgeneratedOTP(result.data);
            });
        }
    }

    function verify(){
        if(otp===''){
            setError('Please enter otp sent to given emailID');
        }
        else{
            if(parseInt(otp)!==generatedOTP){
                setError('Incorrect OTP');
                console.log(otp);
                console.log(generatedOTP);
            }
            else{
                setVerified(true);
                setError('');
            }
        }
    }

    return(
        <div className='main-div-container'>
            <h1>Signup</h1><br /><br />
            <input type="text" placeholder="Enter email id" onChange={(event)=>{setEmail(event.target.value)}} className='input-box'/><br /><br />
            <button className='login-signup-button' style={{backgroundColor:'green'}} onClick={genOTP}>Send OTP</button>
            <br /><br />
            <div style={verified ? {display:'none'}:{display:'block'}}>
            <input type='number' placeholder='Enter OTP' style={{marginRight:'10px',height:'25px'}} value={otp} onChange={(event)=>{setOtp(event.target.value)}}/>
            <button  className='login-signup-button' style={{backgroundColor:'green'}} onClick={verify}>Verify</button>
            </div>
            <div style={{display: verified ? 'block':'none',color:'grey',fontStyle:'italic'}}>Verified</div>
            <br />
            <input type="text" placeholder="Enter full name" onChange={(event)=>{setUname(event.target.value)}} className='input-box'/><br /><br />
            <input type="password" placeholder="Enter password" onChange={(event)=>{setPass(event.target.value)}} className='input-box'/><br /><br />
            <br />
            <div className="role-label">
                <label style={{color: role==='member' ? 'black':'grey'}}>
                    <input type="radio" value="member" name="roleID" onClick={roleChange} />Register as a Member<br />
                </label>
                <label style={{color: role==='lead' ? 'black':'grey'}}>
                    <input type="radio" value="lead" name="roleID" onClick={roleChange}/>Register as a Lead<br /><br />
                </label>
            </div>
            <p className='error-message'>{error}</p>
            <button onClick={handleClick} className='login-signup-button'>Create Account</button>
            <br /><br />
            <Link to='/login'>Aleady have an account?</Link>
        </div>
    )
}
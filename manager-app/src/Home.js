import { Link } from 'react-router-dom';
import taskList from './images/taskList.png';

export default function Home(){
    return(
        <div className="main-div-container">
            <h1>Effortlessly assign and track tasks with this easy to use Task Manager App</h1>

            <div className='column-grid'>
            <div>
                <div className='sub-div-container'>
                    <div className='sub-heading'>New User?</div>
                    <Link to="signup"><button className='login-signup-button'>Signup</button></Link>
                </div>
                <div className='sub-div-container'>
                    <div className='sub-heading'>Already have an account?</div>
                    <Link to="login"><button className='login-signup-button'>Login</button></Link>
                </div>
                <div className='div-footer'>
                    Create accounts for you and your team to assign work, collaborate and finish tasks on time.
                </div>
            </div>

            <div>
                <img src={taskList} alt="not loaded!" className="image-div"/>
            </div>
            </div>
            
        </div>
    )
}
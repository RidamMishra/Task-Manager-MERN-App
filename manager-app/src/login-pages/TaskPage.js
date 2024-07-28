import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

import team from '../images/team.jpg';
import assignTask from '../images/assign-task.jpg';
import updateDelete from '../images/update-delete.jpg';
import personTask from '../images/person-task.jpg';

export default function LeadHome(){
    const navigate = useNavigate();

    return(
        <div className='main-div-container taskpage-container'>
            <Header />

            <div className='options-div'>
                <div className='option' onClick={()=>{navigate('/taskpage/create')}}>
                    <img src={team} alt='ERROR!' className='taskpage-image'/>
                    <p className='task-heading'>Create/Delete your team</p>
                    <ol>
                        <li>Create a new team</li>
                        <li>Add it to the database</li>
                        <li>Delete teams from database after work completion</li>
                    </ol>
                </div>

                <div className='option' onClick={()=>{navigate('/taskpage/addmembers')}}>
                    <img src={assignTask} alt='ERROR!' className='taskpage-image'/>
                    <p className='task-heading'>Add Members to your team</p>
                    <ol>
                        <li>Search for members</li>
                        <li>Add members to teams</li>
                        <li>Assign and update their tasks</li>
                    </ol>
                </div>

                <div className='option' onClick={()=>{navigate('/taskpage/update')}}>
                    <img src={updateDelete} alt='ERROR!' className='taskpage-image'/>
                    <p className='task-heading'>View/Update task status</p>
                    <ol>
                        <li>View all the tasks assigned</li>
                        <li>Mark tasks as completed</li>
                        <li>Delete assigned tasks</li>
                    </ol>
                </div>

                <div className='option' onClick={()=>{navigate('/taskpage/mytasks')}}>
                    <img src={personTask} alt='ERROR!' className='taskpage-image'/>
                    <p className='task-heading'>View My Tasks</p>
                    <ol>
                        <li>View tasks assigned to you</li>
                        <li>Check their completion status</li>
                        <li>Get work done on time</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
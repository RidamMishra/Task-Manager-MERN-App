import './App.css';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

import TaskPage from './login-pages/TaskPage';
import CreateTeam from './login-pages/CreateTeam';
import AddMembers from './login-pages/AddMembers';
import Update from './login-pages/Update';
import MyTasks from './login-pages/MyTasks';

import { Route,Routes } from 'react-router-dom';

export default function PrivateRoute() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/taskpage' element={<TaskPage/>}/>
        <Route path='/taskpage/create' element={<CreateTeam/>}/>
        <Route path='/taskpage/addmembers' element={<AddMembers/>}/>
        <Route path='/taskpage/update' element={<Update/>}/>
        <Route path='/taskpage/mytasks' element={<MyTasks/>}/>
      </Routes>
    </div>
  );
}

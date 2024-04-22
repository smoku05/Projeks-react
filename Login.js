import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import SignIn from './SignIn.js';
import App from './App.js';
import './login.css';

function Login(){
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleUsernameInputChange = (event) => {
      const user = event.target.value;
      setLoginData({...loginData, username: user});
    };
    
    const handlePasswordInputChange = (event) =>{
        const pass = event.target.value;
        setLoginData({...loginData, password: pass})
    };

     //zdobywanie użytkowników
     const getUsersFromLocalStorage = async () => {
        console.log("rgr");
        const userKeys = Object.keys(localStorage).filter(key => key.startsWith("User"));

        for (let i = 0; i < userKeys.length; i++) {
            const indexOfUser = i + 1;
            const user = localStorage.getItem(`User ${indexOfUser}`);
            const userObj = JSON.parse(user);
            console.log(userObj.username)
            console.log(loginData.username)
            console.log(userObj.password)
            console.log(loginData.password)
            if (userObj.username === loginData.username && userObj.password === loginData.password) {
                console.log("ergrehrehreh takkkkkkkk");
                sessionStorage.setItem("user", userObj.username);
            }
            
        }
        navigate('/');
  };


  
    return (
    <div className='login'>
      <div className="card">
          <h1 className='login-txt'>Login</h1>
          <p className='login-txt'>Wpisz nazwę użytkownika</p>
          <input className='login-input' type="text" value={loginData.username} onChange={handleUsernameInputChange} placeholder="Wprowadź nazwę użytkownika"></input>
          <p className='login-txt'>Wpisz hasło</p>
          <input className='login-input' type='password' value={loginData.password} onChange={handlePasswordInputChange} placeholder='Wpisz hasło'></input>
          <Link to="/signin">
            <h4>Nie masz konta? Zarejestruj się.</h4>
          </Link>
          <button className='login-button' onClick={getUsersFromLocalStorage}>Zaloguj się</button>
      </div>
      <Routes>
        <Route path='/signin' element={<SignIn/>}></Route>
        <Route path='/' element={<App/>}></Route>
      </Routes>
    </div>
    );
  }

  export default Login;
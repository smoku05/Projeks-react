import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import App from './App.js';
import './login.css';

function SignIn(){
    const [newUserData, setNewUserData] = useState({ username: "", password: "" })
    const [secondPass, setSecondPass] = useState("");
    const navigate = useNavigate();

    const handleUsernameInputChange = (event) => {
        const user = event.target.value;
        setNewUserData({...newUserData, username: user});
      };
      
      const handlePasswordInputChange = (event) =>{
          const pass = event.target.value;
          setNewUserData({...newUserData, password: pass})
      };

      const handleSecondPasswordInputChange = (event) =>{
        const pass = event.target.value;
        setSecondPass(pass);
    };

       //zapisywanie lokalnie użytkownika
    const saveUserToLocalStorage = async () => {
        if(newUserData.password !== secondPass){
            alert("Hasła się nie zgadzają"); 
        return;
        }

        const userKeys = Object.keys(localStorage).filter(key => key.startsWith("User"));


        const newUser = {
            username: newUserData.username,
            password: newUserData.password
        }

        for (let i = 0; i < userKeys.length; i++) {
            const indexOfUser = i + 1;
            const user = localStorage.getItem(`User ${indexOfUser}`);
            const userObj = JSON.parse(user);

            if (userObj.username === newUserData.username) {
                alert("Jest już użytkownik z taką nazwą użytkownika");
            return;
            }
            else{
                try {
                    localStorage.setItem(`User ${userKeys.length + 1}`, JSON.stringify(newUser));
                  } catch (error) {
                    alert(error);
                    console.error(error);
                  }
            }
    }
    navigate('/');
  };

    return (
    <div className='login'>
        <div className="card">
            <h1 className='login-txt'>Sign In</h1>
            <p className='login-txt'>Wpisz nazwę użytkownika</p>
            <input className='login-input' type="text" value={newUserData.username} onChange={handleUsernameInputChange} placeholder="Wprowadź nazwę użytkownika"></input>
            <p className='login-txt'>Wpisz hasło</p>
            <input className='login-input' type='password' value={newUserData.password} onChange={handlePasswordInputChange} placeholder='Wpisz hasło'></input>
            <p className='login-txt'>Powtórz hasło</p>
            <input className='login-input' type='password' value={secondPass} onChange={handleSecondPasswordInputChange} placeholder='Powtórz hasło'></input>
            <button className='login-button' onClick={saveUserToLocalStorage}>Zarejestruj się</button>
        </div>
        <Routes>
            <Route path='/' element={<App/>}></Route>
        </Routes>
    </div>    
      );
  };

  export default SignIn;
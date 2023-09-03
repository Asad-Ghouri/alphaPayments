import React from 'react'
import logo from '../Images/IMG_3028.JPG'
import { Icon } from 'react-icons-kit'
import { eye } from 'react-icons-kit/feather/eye'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import '../CSS/Login.css';
import { useState } from 'react'

import { NavLink, useNavigate } from "react-router-dom";



const Signup = () => {

  const navigate= useNavigate();
  const [user, setuser] = useState({
    Name: "", email: "", password: ""
  });

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setuser({...user, [name]:value});
    console.log(user);
  }
  const postData = async (e) => {

    e.preventDefault();
    const { Name, email, password } = user;

    const res = await fetch('/Registration', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Name, email, password
      })

    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("User already Exist"); console.log("User already Exist");
    } else {
      window.alert(" Registration Successfull"); console.log("Successfull Registration");
      navigate("/");
    }
  }
    const handleToggle = () => {

      if (type === 'password') {
        setIcon(eye);
        setType('text');
      }
      else {
        setIcon(eyeOff);
        setType('password');
      }
    }


    return (
      < div className='container'>
        <form className='Loginform' method='POST'>
          <div className='formlogo'>
            <img src={logo} alt="Logo" />
          </div>
          <div className='title'><h1>Create your account</h1></div>
          <div className='input-container1'>
            <input type="text" name='Name' id='name' autoComplete='off' required className='text-input1' value={user.Name} onChange={handleInputs} />
            <label htmlFor="name" className='label'>Full name</label>
          </div>
          <div className='input-container1'>
            <input type="text" name='email' id='email' autoComplete='off' required className='text-input1' value={user.email} onChange={handleInputs} />
            <label htmlFor="email" className='label'>Email address</label>
          </div>
          <div className='input-container1'>
            <input type={type} name='password' id='password' autoComplete='off' required className='text-input1' value={user.password} onChange={handleInputs} />
            <label htmlFor="password" className='label'>Password</label>
            <span onClick={handleToggle} className='icon'><Icon icon={icon} size={20} color='black' /></span>
          </div>
          <button type="submit" className='Login' onClick={postData}>Create</button>
          <div className='Sigin-Up' > <h1>Have an account?<span><NavLink to="/"> Sign in</NavLink></span></h1>
          </div>
        </form>
      </div>

    )
  }

  export default Signup

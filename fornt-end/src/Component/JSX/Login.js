import React from 'react'
import logo from '../Images/IMG_3028.JPG'
import { Icon } from 'react-icons-kit'
import { eye } from 'react-icons-kit/feather/eye'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import '../CSS/Login.css';
import { useState , useEffect } from 'react'
import { NavLink , useNavigate } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux"


const Login = ({getid}) => {

  const navigate= useNavigate();

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  
  const dispatch = useDispatch();
  const authToken = localStorage.getItem('token');

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

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
  const Userlogin = async (e) => {

    e.preventDefault();
    const res = await fetch('/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, password
      })

    });
    const data = await res.json();
    const idd=data.userId
    localStorage.setItem('token', idd);
    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else {
      window.alert(" Sign in Successfull");
      dispatch({
        type:"LOGIN",
        UserId : idd
      })
      navigate("/GetApikey");

    }
  }
  
  useEffect(() => {
    if(authToken)
    {
        navigate("/MerchatDashboard");
    }
}, []);
  return (
    < div className='container'>
      <form className='Loginform' method='POST'>
        <div className='formlogo'>
          <img src={logo} alt="Logo" />
        </div>
        <div className='title'><h1>Sign in</h1></div>
        <div className='input-container1'>
          <input type="text" id='email' autoComplete='off' required className='text-input1'value={email} onChange={(e)=> setemail(e.target.value)} />
          <label htmlFor="email" className='label'>Email address</label>
        </div>
        <div className='input-container1'>
          <input type={type} id='password' autoComplete='off' required className='text-input1' value={password} onChange={(e)=> setpassword(e.target.value)}/>
          <label htmlFor="password" className='label'>Password</label>
          <span onClick={handleToggle} className='icon'><Icon icon={icon} size={20} color='black' /></span>
        </div>
        <button type="submit" className='Login' onClick={Userlogin}>Login</button>
      <div className='Sigin-Up' > <h1>No account?<span><NavLink to="/signUp"> Sign up</NavLink></span></h1>
      </div>
      </form>
    </div>

  )
}

export default Login

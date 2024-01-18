import React, { useState,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../components/css/Login/Login.css'
import logo from '../images/logo.png'





const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Redirect to home if token exists
    }
  }, [navigate]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage or a state management system
        localStorage.setItem('authToken', data.token);
         navigate('/')
        console.log('Login successful', data);
      } else {
        console.log('Login failed. Status:', response.status);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div id="container-item">
    
    <img id="weblogo" src={logo} alt='logoimg'/>
    <div id="login-div">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={loginData.email}
          onChange={handleInputChange}
        />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
        />
        <br />

        <button id="submit-button" type="submit">Login</button>
      </form>
      <div className="home-buttons">
        Not a user create a new account click.
        <Link  to="/register" className="btn btn-primary">
          Sign Up
        </Link>
        
      </div>

    </div></div>
  );
};

export default Login;

import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../components/css/Login/Login.css'
import logo from '../images/logo.png'

const Adminreg = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Redirect to home if token exists
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType:'admin',
    key:'',
  });
  const [error, setError] = useState(null); // To display potential errors
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const secret ="SecretKey"


  
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (secret === formData.key){
    const userExists = await axios.get(`http://localhost:5000/auth/check-email/${formData.email}`);
      if (userExists.data.exists) {
        setError('Email already exists. Please try a different email or log in.');
        return;
      }

    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData);
      navigate('/login'); // Redirect to /login on success
      console.log('Registration successful:', response.data);

    } catch (error) {
      // Handle registration failure
      console.error('Registration failed:', error);
      setError('Registration failed. Please check your details and try again.');
    }
  }
  else{
    setError('Registration failed. Invalid Key.');

  }
}
  

  return (
    <div id="container-item">
    
    <img id="weblogo" src={logo} alt='logoimg'/>
    <div id="register-div">
      <form onSubmit={handleRegister}> {/* Use onSubmit for controlled forms */}
        <h3>admin secret key</h3>
        <label htmlFor="name">Secret Key</label>
        <input type="password" id="key" name="key" value={formData.key} onChange={handleInputChange} required />
        <br />


        <h2>Registration Form</h2>
        {error && <div className="error">{error}</div>} {/* Display any errors */}
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        <br />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <br />

        <button id="submit-button" type="submit">Register</button>
      </form>
      <div className="home-buttons">
        Already a user go to Login and Login 
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
        
      </div>
    </div></div>
  );
};

export default Adminreg;





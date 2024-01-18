import React from 'react';
import Navbar from '../Navbar/Navbar';
import '../css/Home/home.css'
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'

function Home() {
  return (
    <>   
    <Navbar />
     <div className="home-container">
      
      <h1 className="home-title">Welcome to Baba Resume – Resume? Babaji will handle it</h1>
      < div id="h1"> <img src={logo} alt='home-img' id="home-img"></img>
      <div className="home-buttons">
        <Link to="/entries" className="btn btn-primary">
          View Entries
        </Link>
        <Link to="/form" className="btn btn-success">
          Create New Form
        </Link>
      </div></div>
      <p className="home-description">At Baba Resume, we take pride in simplifying the resume creation process for you. <br/>Our platform is dedicated to providing professional resumes with a touch of expertise, utilizing a variety of meticulously designed templates. <br/>Let Baba Ji guide you through a seamless journey to create a resume that captures your skills, experiences, and aspirations.</p>

      
    </div></>

  );
}

export default Home;

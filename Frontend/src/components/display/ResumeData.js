import React, { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../css/display/ResumeData1.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css'; 

const ResumeData = () => {
  const [resumeData, setResumeData] = useState(null);
  const { id } = useParams();

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
  
        const response = await fetch(`http://localhost:5000/form-submissions/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setResumeData(data);
          console.log(data);
        } else {
          console.error('Error fetching data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [id]);

  const handleDownloadPDF = () => {
    const pdfContainer = document.getElementById('resumeData');
    
    html2canvas(pdfContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = 'resume.pdf';
      pdf.save(fileName);
    });
  };


  const displayHyperlinks = (Hyperlinks) => (
  <>
      {Hyperlinks.map((linkObj, index) => (
        <li key={index}>
          <i className="fa fa-link"></i> 
          <a href={linkObj.link} className="resume-item" target="_blank" rel="noopener noreferrer">
            {linkObj.link}
          </a>
        </li>
      ))}
    </>
  );

  const displayEducation = (educations) => (
    <div>
      <h2 className="resume-section">Education</h2>
      <hr className="hrdiv" />
      {educations?.map((education, index) => (
        <div key={index} className="resume-education">
          <h5>{education.degree}</h5>
          <h6>{education.school}</h6>
          <i className="fa fa-calendar">
            {education.fromYear} - {education.toYear}
          </i>
        </div>
      ))}
    </div>
  );

  const displaySkills = (skills) => (
    <div>
      <h2 className="resume-section">Skills</h2>
      <hr className="hrdiv" />
      <ul className="resume-list" id="skill-list">
        {skills.map((skill, index) => (
          <li key={index} className="resume-item">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
  

  const displayCertifications = (certifications) => (
    <div>
      <h2 className="resume-section">Certifications</h2>
      <hr className="hrdiv" />
      {certifications.map((certification, index) => (
        <div key={index}>
          <h5>{certification.course}</h5>
          <p className="resume-certification">{certification.institute}</p>
        </div>
      ))}
    </div>
  );

  const displayProjects = (projects) => (
    <div>
      <h2 className="resume-section">Projects</h2>
      <hr className="hrdiv" />
      {projects.map((project, index) => (
        <div key={index}>
          <h4>{project.name}</h4>
          <i className="far fa-calendar"> {project.date}</i>
          <i className="fa fa-map-pin"> {project.location}</i>
          <p className="resume-description">{project.description}</p>
          <p className="resume-hyperlink">
            <a href={project.hyperlink} target="_blank" rel="noopener noreferrer">
              {project.hyperlink}
            </a>
          </p>
        </div>
      ))}
    </div>
  );

 


  return (
    
    <div id="resume">
      <div id="resumeData" className="resume-container">
        {resumeData && (
          <>
            <h1 className="resume-name">{resumeData.name}</h1>
            <hr />
            <div id="basic-info">
              <p className="resume-phone">
                <i className="fa fa-phone"></i> {resumeData.phone}
              </p>
              <p className="resume-email">
                <i className="fa fa-envelope"></i> {resumeData.email}
              </p>
              <p className="resume-address">
                <i className="fa fa-map-marker"></i> {resumeData.Address}
              </p>
              {displayHyperlinks(resumeData.Hyperlinks)}
            </div>
            <div id="summary-div">
              <h2>Summary</h2>
              <hr className="hrdiv" />
              <p className="resume-summary">{resumeData.summary}</p>
            </div>
          </>
        )}
        <div id="coldiv">
          <div id="coldiv1">
            {resumeData && displayEducation(resumeData.educations)}
            {resumeData && displayProjects(resumeData.projects)}
          </div>
          <div id="coldiv2">
            {resumeData && displaySkills(resumeData.skills)}
            {resumeData && displayCertifications(resumeData.certifications)}
          </div>
        </div>
      </div>

      
      <div id="download-button">
        <button onClick={handleDownloadPDF}>Download as PDF</button>
      </div>


     
          
    </div>

  );
};

export const getResumeDataAsHtml = () => {
  const resumeData = <ResumeData />;
  return renderToString(resumeData);
};


export default ResumeData;

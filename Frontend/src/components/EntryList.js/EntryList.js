import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import '../css/List/List.css'

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    const token = localStorage.getItem('authToken');
   
    try {
      const response = await axios.get('http://localhost:5000/form-submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  
  };

  useEffect(() => {
    fetchEntries();
  }, []); // Fetch entries on component mount

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:5000/form-submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('Entry deleted successfully');
        fetchEntries(); // Fetch entries again after deletion
      } else {
        console.log('Error deleting entry. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleUpdate = (id) => {
    // Navigate to the UpdateForm component with the selected entry ID
    navigate(`/updateForm/${id}`);
  };


  function openAndPrintPage(id) {
    const pageUrl = `http://localhost:3000/Resume/${id}`; // Replace with the actual URL
  
    // Open the page in a new window
    window.open(pageUrl, "_blank");
  
    // Wait for the page to load before prompting for printing
    const printWindow = window.open('', '_self');
    printWindow.onload =()=>{
      
    }
    // printWindow.onload = () => {
    //   // printWindow.focus(); // Ensure focus is on the new window
    //   // printWindow.print(); // Trigger the print dialog
    //   // printWindow.close(); // Close the window after printing
    //   window.print()
    // };
  }





  // const handleViewResume = (id) => {
  //   // Navigate to the Resume component with the selected entry ID
  //   navigate(`/Resume/${id}`);
  // };

  return (
   <>
   <Navbar />
   <div id="list">
      <h2>Entry List</h2>
      <ol id="entry-list">
        {entries.map((entry) => (
          <li key={entry._id}>
            <h2>
            {entry.name}</h2>
            {/* Add other fields you want to display */}
            <button onClick={() => handleUpdate(entry._id)}>Update</button>
            <button onClick={() => handleDelete(entry._id)}>Delete</button>
            <button onClick={() => openAndPrintPage(entry._id)}>View Resume</button>
          </li>
        ))}
      </ol>
    </div></>
  );
};

export default EntryList;

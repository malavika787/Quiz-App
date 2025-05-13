//starting code for homepage - just added logout functionality for now, will change later.
import React from 'react';
import Navbar from '../components/Navbar';
import Dashboard from './Dashboard'; //to show the dashboard

const Home = () => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token; //converting token to boolean to see if it exists or not

  const handleLogout = () => { //to remove the token and redirect to login on logout
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} showCreateButton={true} />
      <Dashboard />
    </>
  );
};

export default Home;

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../store/auth-context';
import Navbar from '../components/Navbar/Navbar';

const Home = () => {
  const ctx = useContext(AuthContext);
  if (ctx.isLoggedIn === false) {
    return <Navigate to='/login' />;
  }
  return (
    <>
      <Navbar />
      <h1>Home</h1>
    </>
  );
};

export default Home;

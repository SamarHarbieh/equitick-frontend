import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Loader from './components/Loader/Loader';
import AuthContext from './store/auth-context';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storeUsedLoggedInToken = localStorage.getItem('token');
    const storedUserLoggedInName = localStorage.getItem('name');
    const storedUserLoggedInEmail = localStorage.getItem('email');

    if (storeUsedLoggedInToken) {
      setIsLoggedIn(true);
    }
    if (storedUserLoggedInName) {
      setUserName(storedUserLoggedInName);
    }
    if (storedUserLoggedInEmail) {
      setUserEmail(storedUserLoggedInEmail);
    }
  }, []);
  const loginHandler = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.user.name);
    localStorage.setItem('email', data.user.email);
    setIsLoggedIn(true);
  };

  const logoutHandler = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const response = await fetch(
        'http://localhost:8000/api/logout',
        requestOptions
      );
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          userName: userName,
          userEmail: userEmail,
          onLogin: loginHandler,
          onLogout: logoutHandler,
          setIsLoading: setIsLoading,
          isLoading: isLoading,
        }}
      >
        {isLoading && <Loader />}

        <Routes>
          <Route path='*' element={<main>PAGE NOT FOUND</main>} />
          <Route
            path='/'
            element={
              !isLoggedIn ? (
                <Login onLogin={loginHandler} />
              ) : (
                <Home onLogout={logoutHandler} />
              )
            }
          />
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/login' element={<Login />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;

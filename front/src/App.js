import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Loader from './components/Loader/Loader';
import PopupMessage from './components/PopupMessage/PopupMessage';
import Register from './pages/Register';
import AuthContext from './store/auth-context';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  useEffect(() => {
    const storeUsedLoggedInToken = localStorage.getItem('token');
    const storedUserLoggedInID = localStorage.getItem('userID');
    const storedUserLoggedInName = localStorage.getItem('name');
    const storedUserLoggedInEmail = localStorage.getItem('email');
    const storedUserLoggedInIsAdmin = localStorage.getItem('isAdmin');

    if (storeUsedLoggedInToken) {
      setIsLoggedIn(true);
    }
    if (storedUserLoggedInID) {
      setUserID(storedUserLoggedInID);
    }

    if (storedUserLoggedInName) {
      setUserName(storedUserLoggedInName);
    }
    if (storedUserLoggedInEmail) {
      setUserEmail(storedUserLoggedInEmail);
    }

    if (storedUserLoggedInIsAdmin) {
      setIsAdmin(storedUserLoggedInIsAdmin);
    }
  }, []);
  const loginHandler = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.user.name);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('userID', data.user.id);
    localStorage.setItem('isAdmin', data.user.isAdmin);
    setIsLoggedIn(true);
    setUserID(data.user.id);
    setUserName(data.user.name);
    setUserEmail(data.user.email);
    setUserEmail(data.user.email);
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
        localStorage.removeItem('userID');
        localStorage.removeItem('isAdmin');
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
          userID: userID,
          userName: userName,
          userEmail: userEmail,
          isAdmin: isAdmin,
          onLogin: loginHandler,
          onLogout: logoutHandler,
          setIsLoading: setIsLoading,
          setOpenPopup: setOpenPopup,
          setPopupContent: setPopupContent,
          isLoading: isLoading,
          openPopup: openPopup,
        }}
      >
        {isLoading && <Loader />}
        {openPopup && <PopupMessage message={popupContent} />}

        <Routes>
          <Route path='*' element={<main>PAGE NOT FOUND</main>} />
          {/* <Route
            path='/'
            element={
              !isLoggedIn ? (
                <Login onLogin={loginHandler} />
              ) : (
                <Home onLogout={logoutHandler} />
              )
            }
          /> */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;

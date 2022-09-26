import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Loader from './components/Loader/Loader';
import PopupMessage from './components/PopupMessage/PopupMessage';
import Register from './pages/Register';
import ProtectedRoutes from './components/ProtectedRoutes';
import AuthContext from './store/auth-context';
import { Navigate } from 'react-router-dom';

const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);
  const [userID, setUserID] = useState(localStorage.getItem('userID') ? localStorage.getItem('userID') : '');
  const [userName, setUserName] = useState(localStorage.getItem('name') ? localStorage.getItem('name') : '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') ? localStorage.getItem('email') : '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') ? parseInt(localStorage.getItem('isAdmin')) : '');
  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  useEffect(() => {
    //const storeUsedLoggedInToken = (localStorage.getItem('token'));
    // const storedUserLoggedInID = localStorage.getItem('userID');
    // const storedUserLoggedInName = localStorage.getItem('name');
    // const storedUserLoggedInEmail = localStorage.getItem('email');
    // const storedUserLoggedInIsAdmin = parseInt(localStorage.getItem('isAdmin'));


    // if (localStorage.getItem('token')) {
    //   setIsLoggedIn(true);
    // }
    // if (storedUserLoggedInID) {
    //   setUserID(storedUserLoggedInID);
      
    // }

    // if (storedUserLoggedInName) {
    //   setUserName(storedUserLoggedInName);
      
    // }
    // if (storedUserLoggedInEmail) {
    //   setUserEmail(storedUserLoggedInEmail);

    // }

    // if (storedUserLoggedInIsAdmin) {
    //   setIsAdmin(storedUserLoggedInIsAdmin);
   
    // }

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
    setIsAdmin(data.user.isAdmin);
  };

  const logoutHandler = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept:'application/json',
      },
    };
    let token = localStorage.getItem('token');
    requestOptions.headers.Authorization = `Bearer ${token}`;
    setIsLoading(true);
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
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
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
          <Route
            path='/'
            element={
              !isLoggedIn ? (
                <Login/>
              ) : (
                <Home/>
              )
            }
          />
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/login' element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path='/register' element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;

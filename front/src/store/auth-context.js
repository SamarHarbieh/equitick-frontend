import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: localStorage.getItem('token')
    ? localStorage.getItem('token')
    : false,
  userID: '',
  userName: '',
  userEmail: '',
  isAdmin: 0,
  isLoading: false,
  openPopup: false,
  popupMessage: '',
});

export default AuthContext;

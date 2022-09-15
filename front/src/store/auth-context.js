import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: localStorage.getItem('isLoggedIn')
    ? localStorage.getItem('isLoggedIn')
    : false,
  userID: '',
  userName: '',
  userEmail: '',
  isAdmin: '',
  isLoading: false,
  openPopup: false,
  popupMessage: '',
});

export default AuthContext;

import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  userID: '',
  userName: '',
  userEmail: '',
  isAdmin: '',
  isLoading: false,
  openPopup: false,
  popupMessage: '',
});

export default AuthContext;

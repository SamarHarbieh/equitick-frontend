import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: '',
  userID: '',
  userName: '',
  userEmail: '',
  isAdmin: '',
  isLoading: false,
  openPopup: false,
  popupMessage: '',
});

export default AuthContext;

import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  userID: '',
  userName: '',
  userEmail: '',
  isAdmin: '',
  isLoading: false,
});

export default AuthContext;

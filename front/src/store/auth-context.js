import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  userName: '',
  userEmail: '',
  isLoading: false,
});

export default AuthContext;

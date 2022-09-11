import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  userName: '',
  userEmail: '',
});

export default AuthContext;

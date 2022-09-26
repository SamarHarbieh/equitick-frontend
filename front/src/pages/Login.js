import { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import AuthContext from '../store/auth-context';
import { Navigate, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCredentialsMessage, setInvalidCredentialsMessage] =
    useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    };

    let errorSent = false;
    try {
      const response = await fetch(
        'http://localhost:8000/api/login',
        requestOptions
      );
      const data = await response.json();

      if (response.status === 201) {
        ctx.onLogin(data);
        navigate('/', { replace: true });
      } else {
        //if invalid credentials
        if (response.status === 401) {
          setInvalidCredentialsMessage(data.message);
          errorSent = false;
        }
      }
    } catch (err) {
      console.error(err);
      if (!errorSent) {
        alert('Server is currently unavailable');
      }
    }
  };

  useEffect(() => {
    console.log(ctx.isLoggedIn);
    if (ctx.isLoggedIn) {
      <Navigate to='/' replace={true} />;
    }
  }, []);

  return (
    <Fragment>
      <div className='container-page'>
        <h1 className='login-register-title'>Login</h1>
        <div className='login-register-form'>
          <form
            className='login-register-form-container'
            action=''
            onSubmit={submitHandler}
          >
            {invalidCredentialsMessage && (
              <div className='invalid-credentials-div'>
                {invalidCredentialsMessage}
              </div>
            )}
            <div className='login-email-section'>
              <label htmlFor='Email'></label>
              <input
                className='login-input-one'
                required
                placeholder='Email@domain.com'
                type='email'
                id='Email'
                name='Email'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className='login-password-section'>
              <label htmlFor='Password'></label>
              <input
                className='login-input-two'
                required
                placeholder='Password'
                type='password'
                id='Password'
                name='Password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className='login-register-button' type='submit'>
              Log in
            </button>
            <div className='register-link-container'>
              <Link to='/register' style={{ color: 'var(--secondary-color)' }}>
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;

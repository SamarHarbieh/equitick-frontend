import { Fragment, useContext, useState } from 'react';
import React from 'react';
import AuthContext from '../store/auth-context';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = (props) => {
  const ctx = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCredentialsMessage, setInvalidCredentialsMessage] =
    useState('');

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.log(data);

      if (response.status === 201) {
        ctx.onLogin(data);
        navigate('/', { replace: true });
      } else {
        if (response.status === 400) {
          setInvalidCredentialsMessage(data.message);
          errorSent = false;
        }
      }
    } catch (err) {
      //If invalid credentials
      console.error(err);
      if (!errorSent) {
        alert('Server is currently unavailable');
      }
    }
  };
  return (
    <Fragment>
      <div className='container-page'>
        <h1 className='login-title'>Login</h1>
        <div className='login-form'>
          <form
            className='login-form-container'
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
            <button className='login-button' type='submit'>
              Log in
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;

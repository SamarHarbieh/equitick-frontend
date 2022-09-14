import { Fragment, useContext, useState } from 'react';
import React from 'react';
import AuthContext from '../store/auth-context';
import { useNavigate, Navigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);
  if (ctx.isLoggedIn) {
    navigate('/', { replace: true });
  }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirmation) {
      setErrorMessage('Please enter all required fields');
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        name: name,
      }),
    };

    let errorSent = false;
    try {
      const response = await fetch(
        'http://localhost:8000/api/register',
        requestOptions
      );
      const data = await response.json();

      if (response.status === 201) {
        console.log(data);
        ctx.onLogin(data);
        navigate('/', { replace: true });
        return;
      }
      if (response.status === 422) {
        if (data.errors) {
          setErrorMessage(Object.values(data.errors)[0][0]);
        }
        return;
      }
    } catch (err) {
      console.log(err);
      if (!errorSent) {
        alert('Server is currently unavailable');
      }
    }
  };
  return (
    <Fragment>
      <div className='container-page'>
        <h1 className='login-register-title'>Register</h1>
        <div className='login-register-form'>
          <form
            className='login-register-form-container'
            action=''
            onSubmit={submitHandler}
          >
            {errorMessage && (
              <div className='invalid-credentials-div'>{errorMessage}</div>
            )}
            <div className='register-name-section'>
              <label htmlFor='name'></label>
              <input
                className='login-input-one'
                required
                placeholder='Your name'
                type='text'
                id='name'
                name='name'
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
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
              <label htmlFor='password'></label>
              <input
                className='login-input-two'
                required
                placeholder='Password'
                type='password'
                id='password'
                name='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className='login-password-confirmation-section'>
              <label htmlFor='password_confirmation'></label>
              <input
                className='login-input-two'
                required
                placeholder='Confirm your password'
                type='password'
                id='password_confirmation'
                name='password_confirmation'
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
              />
            </div>
            <button className='login-register-button' type='submit'>
              Register
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
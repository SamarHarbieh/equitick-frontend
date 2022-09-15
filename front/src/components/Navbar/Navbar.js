import React, { useContext } from 'react';
import './Navbar.css';
import AuthContext from '../../store/auth-context';
import AVATAR from '../../assets/avatar-icon.svg';

const Navbar = () => {
  const ctx = useContext(AuthContext);
  return (
    <header>
      <nav>
        <div className='nav-left-container'>
          <h2>
            Equitcks
            <span className='header-title-span'>Trading</span>
          </h2>
          <h3>Welcome back</h3>
        </div>

        <div className='navbar-right'>
          {ctx.isLoggedIn && (
            <>
              <div className='avatar-container'>
                <img src={AVATAR} alt='user' className='avatar' />
                <h4 className='user-name'>{ctx.userName}</h4>
              </div>

              <button onClick={ctx.onLogout} className='logout-btn'>
                {' '}
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

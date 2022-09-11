import React, { useContext } from 'react';
import './Navbar.css';
import AuthContext from '../../store/auth-context';
import AVATAR from '../../assets/avatar-icon.svg';

const Navbar = () => {
  const ctx = useContext(AuthContext);
  return (
    <header>
      <nav>
        <h2>Sky Blue Trading</h2>
        <div className='navbar-right'>
          {ctx.isLoggedIn && (
            <>
              <div>
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

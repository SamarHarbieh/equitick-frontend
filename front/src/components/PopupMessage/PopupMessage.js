import { React, useContext } from 'react';
import './PopupMessage.css';
import AuthContext from '../../store/auth-context';

const PopupMessage = (props) => {
  const ctx = useContext(AuthContext);
  return (
    <div className='popup-container'>
      <div className='popup-content-container'>
        <p>{props.message}</p>
        <a className='popup-icon' onClick={() => ctx.setOpenPopup(false)}>
          OK
        </a>
      </div>
    </div>
  );
};

export default PopupMessage;

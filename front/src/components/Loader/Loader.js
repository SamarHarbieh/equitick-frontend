import React from 'react';
import './Loader.css';
import loader from '../../assets/loader.svg';

const Loader = () => {
  return (
    <div className='loader-container'>
      <div className='loader-image-container'>
        <img src={loader} alt='loader' />
      </div>
    </div>
  );
};

export default Loader;

import React from 'react';
import './common.css';

const Spinner = ({ size = 'md', color = 'primary', text = '' }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className={`spinner spinner-color-${color}`} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;

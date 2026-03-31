import React, { forwardRef } from 'react';
import './common.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  id,
  name,
  className = '',
  icon = null,
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && <label htmlFor={id || name} className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`input-field ${icon ? 'input-with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

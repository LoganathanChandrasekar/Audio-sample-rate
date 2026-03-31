import React from 'react';
import './common.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  className = '',
  id,
}) => {
  const baseClass = 'btn';
  const classes = [
    baseClass,
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      id={id}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner" />}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;

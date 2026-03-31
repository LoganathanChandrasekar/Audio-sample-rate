import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';
import './common.css';

const ToastContainer = () => {
  const { toasts } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onDismiss}>✕</button>
    </div>
  );
};

export default ToastContainer;

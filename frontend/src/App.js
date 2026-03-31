import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/common/Toast';
import './index.css';

/**
 * Root application component.
 * Wraps the app with Redux Provider, BrowserRouter, and Toast notifications.
 */
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';
import './pages.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="primary" size="md" icon="🏠">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';
import './pages.css';

const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Welcome Back</h2>
      <p className="auth-form-subtitle">Sign in to your account to continue</p>

      {error && (
        <div className="auth-error" onClick={clearError}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon="📧"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon="🔒"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          id="btn-login"
        >
          Sign In
        </Button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="auth-link">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

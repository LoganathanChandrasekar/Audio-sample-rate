import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';
import './pages.css';

const RegisterPage = () => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    await registerUser(data.name, data.email, data.password);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Create Account</h2>
      <p className="auth-form-subtitle">Start recording professional audio today</p>

      {error && (
        <div className="auth-error" onClick={clearError}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon="👤"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
          })}
        />

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
          placeholder="Min 8 chars, uppercase, lowercase, number"
          icon="🔒"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            validate: {
              hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain uppercase letter',
              hasLowercase: (v) => /[a-z]/.test(v) || 'Must contain lowercase letter',
              hasNumber: (v) => /[0-9]/.test(v) || 'Must contain a number',
            },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon="🔒"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          id="btn-register"
        >
          Create Account
        </Button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="auth-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

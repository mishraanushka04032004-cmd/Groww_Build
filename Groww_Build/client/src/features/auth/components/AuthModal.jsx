import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoAlertCircleOutline } from 'react-icons/io5';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = authModalMode === 'login';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && (!formData.name || formData.name.trim().length < 2)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!isLogin) {
      if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one letter and one number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ name: formData.name, email: formData.email, password: formData.password });
      }
      // Reset form on success
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      const message = err.message || (err.details && err.details[0]?.message) || 'Authentication failed. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setAuthModalMode(newMode);
    setErrors({});
    setServerError('');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isLogin ? 'Sign In to Groww.Watch' : 'Create a Free Account'}
      description={
        isLogin
          ? 'Access your personal baselines and prioritized market changes.'
          : 'Start tracking meaningful market anomalies across your watchlists.'
      }
    >
      <div className="flex border-b border-[#FFD6A7] mb-5">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
            isLogin
              ? 'border-[#8C3F27] text-[#370A00]'
              : 'border-transparent text-[#7C2808] hover:text-[#370A00]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
            !isLogin
              ? 'border-[#8C3F27] text-[#370A00]'
              : 'border-transparent text-[#7C2808] hover:text-[#370A00]'
          }`}
        >
          Create Account
        </button>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-[#A51D24]/10 border border-[#A51D24]/30 text-[#A51D24] text-xs flex items-center gap-2.5 font-medium">
          <IoAlertCircleOutline className="w-5 h-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <Input
            id="register-name"
            name="name"
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            icon={IoPersonOutline}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
        )}

        <Input
          id="auth-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          icon={IoMailOutline}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="auth-password"
          name="password"
          type="password"
          label="Password"
          placeholder="Minimum 8 characters"
          icon={IoLockClosedOutline}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          helperText={!isLogin ? 'Must contain at least 8 characters, with letters and numbers.' : undefined}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center text-sm font-bold text-[#FFF7ED] bg-[#370A00] hover:bg-[#250700] rounded-xl py-3 shadow-md"
            isLoading={isSubmitting}
          >
            {isLogin ? 'Sign In' : 'Create Account & Start Tracking'}
          </Button>
        </div>
      </form>

      <div className="mt-5 text-center text-xs text-[#7C2808]">
        {isLogin ? (
          <p>
            Do not have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-[#8C3F27] hover:underline font-bold ml-1"
            >
              Sign up now
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-[#8C3F27] hover:underline font-bold ml-1"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
};


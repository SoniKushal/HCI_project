import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const validatePasswords = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validatePasswords()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div
      className="flex items-center justify-center py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg flex overflow-hidden"
        style={{ width: '700px', minHeight: '80vh' }}
      >
        <div className="w-5/12 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-lg text-gray-500">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={showPassword.newPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-lg"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword.newPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-lg"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword.confirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            
            <button type="submit" className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600">
              Reset Password
            </button>
          </form>

          {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

          <p className="text-center text-gray-600 text-lg mt-4">
            Remember your password?{' '}
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="w-7/12">
          <img src={foodImage} alt="Food" className="object-cover h-full w-full" />
        </div>
      </div>
    </div>
  );
}

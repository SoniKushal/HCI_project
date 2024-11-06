import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png";

const ForgotPasswordPage = () => {
  const  [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
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
        <div className="w-1/2 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-lg text-gray-500">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Email"
              required
            />
            
            <button type="submit" className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600">
              Send Password Reset Link
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

        <div className="w-1/2 relative bg-orange-100">
          <img src={foodImage} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
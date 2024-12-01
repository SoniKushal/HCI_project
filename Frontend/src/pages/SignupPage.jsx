import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    isOwner: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleTabClick = (isOwner) => {
    setFormData({
      ...formData,
      isOwner,
    });
    // Clear all errors when switching tabs
    setErrors({});
    setServerError('');
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits long";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = 
        "Password must contain:\n" +
        "- At least 6 characters\n" +
        "- One uppercase letter\n" +
        "- One lowercase letter\n" +
        "- One number\n" +
        "- One special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateFields()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        // Handle specific error cases
        if (data.message.includes('duplicate key error')) {
          if (data.message.includes('email')) {
            setErrors(prev => ({ ...prev, email: 'Email already exists' }));
            toast.error('Email already exists');
          } else if (data.message.includes('phone')) {
            setErrors(prev => ({ ...prev, phone: 'Phone number already exists' }));
            toast.error('Phone number already exists');
          }
        } else {
          setServerError(data.message);
          toast.error(data.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setServerError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}>
      <div className="bg-white rounded-lg shadow-lg flex overflow-hidden"
        style={{ width: '700px', minHeight: '80vh' }}>
        {/* Left side with form */}
        <div className="w-5/12 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Signup</h2>
            <p className="text-lg text-gray-500">Sign up to continue</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-between border-b-2 mb-4">
            <button
              className={`flex-1 text-center py-2 font-bold ${
                !formData.isOwner ? 'text-blue-600 border-b-4 border-blue-600' : 'text-black'
              }`}
              onClick={() => handleTabClick(false)}
            >
              Sign in as <br /> Customer
            </button>
            <button
              className={`flex-1 text-center py-2 font-bold ${
                formData.isOwner ? 'text-blue-600 border-b-4 border-blue-600' : 'text-black'
              }`}
              onClick={() => handleTabClick(true)}
            >
              Sign in as <br /> Owner
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
            {/* Display server error at the top of the form if exists */}
            {serverError && (
              <div className="p-2 text-red-600 bg-red-100 rounded-md text-sm">
                {serverError}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Phone"
                autoComplete="off"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email"
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-lg ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-600 text-lg mt-3">
              Already have an account?{' '}
              <a href="/login" className="text-black font-bold hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>

        <div className="w-7/12 relative bg-orange-100">
          <img src={foodImage} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

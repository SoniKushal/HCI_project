import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTabClick = (isOwner) => {
    setFormData({
      ...formData,
      isOwner,
    });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits long";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long, contain one uppercase, one lowercase, one number, and one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
      
        navigate('/'); // Redirect to home page on success
      } else {
        const error = await response.json();
        console.error('Error during signup:', error.message);
        alert(error.message); // Show error message
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div
      className="flex items-center justify-center py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg flex overflow-hidden"
        style={{ width: '700px', minHeight: '80vh' }}
      >
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
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Name"
              autoComplete="off"
              required
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Phone"
              autoComplete="off"
              required
            />
            {errors.phone && <p className="text-red-600">{errors.phone}</p>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Email"
              autoComplete="off"
              required
            />
            {errors.email && <p className="text-red-600">{errors.email}</p>}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
            {errors.password && <p className="text-red-600">{errors.password}</p>}

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

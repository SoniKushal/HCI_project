import React, { useState } from 'react';
import googleLogo from '/src/assets/google.png';
import pizzaImage from '/src/assets/indian.jpg'; // Side image import

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [signintype, setsignintype] = useState('customer');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  const handlesigninTypeChange = (type) => {
    setsignintype(type);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url('/src/assets/Untitled.png')` }}>
      <div className="bg-yellow-500 p-8 rounded-lg rounded-tr-none rounded-br-none shadow-lg w-96 opacity-950 relative ml-[15%]">
        <h2 className="text-black text-2xl font-bold text-center mb-4">Sign in</h2>

        {/* Sign in Type Selection Bar */}
        <div className="flex overflow-x-auto bg-gray-100 p-2 mb-2 rounded-lg">
          <button
            onClick={() => handlesigninTypeChange('customer')}
            className={`flex-grow p-2 font-bold text-center ${signintype === 'customer' ? 'text-blue-500 border-b-4 border-blue-500' : ''}`}
          >
            Sign in as Customer
          </button>
          <button
            onClick={() => handlesigninTypeChange('owner')}
            className={`flex-grow p-2 font-bold text-center ${signintype === 'owner' ? 'text-blue-500 border-b-4 border-blue-500' : ''}`}
          >
            Sign in as Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {['email', 'password'].map((field) => (
            <input
              key={field}
              type={field.includes('password') ? 'password' : 'email'}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded-lg"
              required
            />
          ))}
        </form>

        <div className="text-left mb-4">
          <a href="/forgot_password" className="text-red-500 text-sm hover:underline cursor-pointer">Forgot Password</a>
        </div>

        {/* Google Sign In Button */}
        <div className="text-center mt-4 space-y-2">
          <button className="w-full bg-black text-yellow-500 py-2 rounded hover:bg-gray-800">Sign in</button>
          <button className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            <img src={googleLogo} alt="Google Logo" className="w-5 h-auto mr-2" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Side Image */}
      <div className="flex justify-center">
        <img src={pizzaImage} alt="Side Visual" className="w-[36rem] h-[26.5rem] rounded-lg opacity-9 ml-[-80%]" />
      </div>
    </div>
  );
};

export default SigninForm;

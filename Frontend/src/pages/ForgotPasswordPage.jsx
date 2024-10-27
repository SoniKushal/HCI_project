import React from 'react';
import foodImage from "/src/assets/indian.jpg"; // Make sure this path is correct
import backgroundImage from "/src/assets/Untitled.png"; // Make sure this path is correct

const ForgotPasswordPage = () => {
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
      {/* Main Container */}
      <div
        className="bg-white rounded-lg shadow-lg flex overflow-hidden"
        style={{ width: '700px', minHeight: '80vh' }} // Adjust the minimum height as needed
      >
        
        {/* Forgot Password Form with Rich Yellow Background */}
        <div className="w-1/2 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-lg text-gray-500">Enter your email to receive a password reset link</p>
          </div>

          <form className="space-y-3">
            {/* Email Field */}
            <input type="email" className="w-full px-3 py-2 border rounded-md text-lg" placeholder="Email" required />
            
            {/* Send Password Reset Link Button */}
            <button type="submit" className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600">
              Send Password Reset Link
            </button>
          </form>
        </div>

        {/* Food Image */}
        <div className="w-1/2 relative bg-orange-100">
          <img src={foodImage} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

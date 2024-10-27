import React from 'react';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png"; 

const SignupPage = () => {
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
        style={{ width: '700px', minHeight: '80vh' }} 
      >
        
        {/* Slightly Narrowed Signup Form Section */}
        <div className="w-5/12 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Signup</h2>
            <p className="text-lg text-gray-500">Sign up to continue</p>
          </div>

          <form className="space-y-3">
            {/* Form Fields */}
            <input type="text" className="w-full px-3 py-2 border rounded-md text-lg" placeholder="Name" />
            <input type="tel" className="w-full px-3 py-2 border rounded-md text-lg" placeholder="Phone" />
            <input type="email" className="w-full px-3 py-2 border rounded-md text-lg" placeholder="Email" />
            <input type="password" className="w-full px-3 py-2 border rounded-md text-lg" placeholder="Password" />

            {/* Checkbox for Restaurant Owner */}
            <div className="flex items-center mt-4">
              <input type="checkbox" id="restaurantOwner" className="mr-2" />
              <label htmlFor="restaurantOwner" className="text-lg text-gray-700">
                Are you a restaurant owner?
              </label>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600">
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-lg mt-3">
              Already have an account?{' '}
              <a href="/login" className="text-black font-bold hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>

        {/* Slightly Widened Food Image Section */}
        <div className="w-7/12 relative bg-orange-100">
          <img src={foodImage} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
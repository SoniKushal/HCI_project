import React, { useContext } from 'react';
// import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  // const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // if (!user) {
  //   return <div className="text-center mt-8">Please log in to view your profile.</div>;
  // }

  return (
    <div className="max-w-[600px] mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-purple-700 text-white text-2xl font-bold flex justify-center items-center rounded-full mr-6">
          {user.name[0].toUpperCase()}{user.name[1].toUpperCase()}
        </div>
        <h1 className="text-3xl text-gray-800">{user.name}</h1>
      </div>
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Name:</label>
          <span className="text-gray-800">{user.name}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Mobile number:</label>
          <span className="text-gray-800">{user.phone}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Email:</label>
          <span className="text-gray-800">{user.email}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">User Type:</label>
          <span className="text-gray-800">{user.userType}</span>
        </div>
      </div>
      <button 
        className="w-full py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300"
      >
        Update Profile
      </button>
      <button 
        className="w-full py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300"
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
}
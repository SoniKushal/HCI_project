import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth-context';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Fetch user profile data from backend
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setUpdatedName(data.name);
          setUpdatedPhone(data.phone);
          setUpdatedEmail(data.email);
        } else {
          console.error('Failed to fetch profile data');
          if(response.status === 401)
          {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (err.response && err.response.status === 401) {
          // Token has expired, redirect to login page
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:4000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          phone: updatedPhone,
          email: updatedEmail,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        console.log('Profile updated successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      {/* Existing profile data display */}
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-purple-700 text-white text-2xl font-bold flex justify-center items-center rounded-full mr-6">
          {profileData.name[0].toUpperCase()}{profileData.name[1].toUpperCase()}
        </div>
        <h1 className="text-3xl text-gray-800">{profileData.name}</h1>
      </div>
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Name:</label>
          <span className="text-gray-800">{profileData.name}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Mobile number:</label>
          <span className="text-gray-800">{profileData.phone}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">Email:</label>
          <span className="text-gray-800">{profileData.email}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">User Type:</label>
          <span className="text-gray-800">{profileData.isOwner ? "Owner" : "Customer"}</span>
        </div>
      </div>

      {/* Update profile form */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] items-center">
            <label className="font-bold text-gray-600">Name:</label>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center">
            <label className="font-bold text-gray-600">Mobile number:</label>
            <input
              type="text"
              value={updatedPhone}
              onChange={(e) => setUpdatedPhone(e.target.value)}
              className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center">
            <label className="font-bold text-gray-600">Email:</label>
            <input
              type="email"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}
        <button
          className={`w-full py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
}


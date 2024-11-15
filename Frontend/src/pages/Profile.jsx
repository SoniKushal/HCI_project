import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Component() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
          setEditedUser(data)
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
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleUpdateProfile = async () => {
    if (!editedUser) return

    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setUser(updatedData)
        setIsEditing(false)
        toast.success('Profile updated successfully')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update profile')
        toast.error(errorData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('An unexpected error occurred. Please try again later.')
      toast.error('An unexpected error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-[600px] mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-orange-500 text-white text-2xl font-bold flex justify-center items-center rounded-full mr-6">
          {user.name[0].toUpperCase()}{user.name[1].toUpperCase()}
        </div>
        <h1 className="text-3xl text-gray-800">{user.name}</h1>
      </div>
      <div className="space-y-4 mb-8">
        {['name', 'phone', 'email'].map((field) => (
          <div key={field} className="grid grid-cols-[120px_1fr] items-center">
            <label htmlFor={field} className="font-bold text-gray-600">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            {isEditing ? (
              <input
                type={field === 'email' ? 'email' : 'text'}
                id={field}
                name={field}
                value={editedUser ? editedUser[field] : ''}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="text-gray-800">{user[field]}</span>
            )}
          </div>
        ))}
        <div className="grid grid-cols-[120px_1fr] items-center">
          <label className="font-bold text-gray-600">User Type:</label>
          <span className="text-gray-800">{user.isOwner ? "Owner" : "Customer"}</span>
        </div>
      </div>
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      <div className="flex space-x-4">
        <button 
          className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
        {isEditing ? (
          <button 
            className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        ) : (
          <button 
            className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}
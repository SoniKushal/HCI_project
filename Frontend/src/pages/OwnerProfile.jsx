import React, { useState,useEffect } from "react";
import Header from "../components/OwnerHeader";
import Sidebar from "../components/Sidebar";

const OwnerProfile = () => {
  const defaultProfilePhoto = "https://via.placeholder.com/100/CCCCCC?text=User";
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const availableProfilePhotos = [
    "src/assets/pfp1.jpg",
    "src/assets/pfp2.jpg",
    "src/assets/pfp3.jpg",
    "src/assets/pfp4.jpeg",
    "src/assets/pfp5.jpg",
    "src/assets/pfp6.jpg",
    
  ];

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "1234567890",
    businessName: "John's Diner",
    taxId: "GST12345",
    yearsOfOperation: "5 years",
    totalRestaurants: 3,
    totalBookings: 1200,
    averageRating: 4.5,
  });

  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessages((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateInputs = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!updatedProfile.name.trim()) {
      errors.name = "Name cannot be empty.";
    } else if (!nameRegex.test(updatedProfile.name)) {
      errors.name = "Name can only contain letters.";
    }

    if (!updatedProfile.email.trim()) {
      errors.email = "Email cannot be empty.";
    } else if (!emailRegex.test(updatedProfile.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!updatedProfile.phone.trim()) {
      errors.phone = "Phone number cannot be empty.";
    } else if (!phoneRegex.test(updatedProfile.phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }

    if (!updatedProfile.businessName.trim()) {
      errors.businessName = "Business Name cannot be empty.";
    }

    if (!updatedProfile.taxId.trim()) {
      errors.taxId = "Tax ID cannot be empty.";
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateInputs()) {
      setProfile({ ...updatedProfile });
      setIsEditing(false);
    }
  };

  const handleProfilePhotoChange = (photoUrl) => {
    setProfilePhoto(photoUrl);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Sidebar open by default for larger screens
      } else {
        setIsSidebarOpen(true); // Sidebar hidden by default for smaller screens
      }
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div
        className={`fixed top-0 z-50 left-0 w-64 h-screen bg-white p-4 transition-transform duration-300 ${
          !isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar />
      </div>
     <div className="min-h-screen bg-gray-100 ">
     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Profile Photo Section */}
        <div className="flex items-center justify-center mb-4">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            title="Click to change profile photo"
          />
        </div>

        {/* Name and Contact Section */}
        <div className="text-center space-y-2 flex flex-col justify-center place-items-center">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={updatedProfile.name}
                onChange={handleInputChange}
                className="text-lg w-1/4 text-gray-600 border border-gray-300 rounded-md px-2 py-1"
              />
              {errorMessages.name && <p className="text-red-500 text-sm">{errorMessages.name}</p>}
            </>
          ) : (
            <p>{profile.name}</p>
          )}
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={updatedProfile.email}
                onChange={handleInputChange}
                className="text-sm w-1/4 align-self-center text-gray-600 border border-gray-300 rounded-md px-2 py-1"
              />
              {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
            </>
          ) : (
            <p className="text-sm text-gray-600">{profile.email}</p>
          )}
          {isEditing ? (
            <>
              <input
                type="tel"
                name="phone"
                value={updatedProfile.phone}
                onChange={handleInputChange}
                className="text-sm w-1/4 text-gray-600 border border-gray-300 rounded-md px-2 py-1"
              />
              {errorMessages.phone && <p className="text-red-500 text-sm">{errorMessages.phone}</p>}
            </>
          ) : (
            <p className="text-sm text-gray-600">{profile.phone}</p>
          )}
        </div>

        {/* Profile Photo Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className=" bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-md">
                <div className="flex max-w-3xl mb-4 w-full justify-center items-center">
                    <h2 className="text-md md:text-lg font-semibold self-center">
                      Choose Your Profile Picture
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="text-lg font-semibold right-2 ml-4 md:ml-20 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
                    >
                        ✕
                    </button>
                    
                </div>
              <div className="grid grid-cols-3 gap-4">
                {availableProfilePhotos.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`Profile ${index + 1}`}
                    className={`w-20 h-20 rounded-full border-4 ${
                      profilePhoto === photoUrl
                        ? "border-blue-500"
                        : "border-gray-300"
                    } cursor-pointer`}
                    onClick={() => handleProfilePhotoChange(photoUrl)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vertically Divided Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div>
              <label className="font-medium">Business Name:</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="businessName"
                    value={updatedProfile.businessName}
                    onChange={handleInputChange}
                    className="block mt-1 text-sm w-full text-gray-600 border border-gray-300 rounded-md px-2 py-1"
                  />
                  {errorMessages.businessName && (
                    <p className="text-red-500 text-sm">{errorMessages.businessName}</p>
                  )}
                </>
              ) : (
                <p>{profile.businessName}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Tax ID:</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="taxId"
                    value={updatedProfile.taxId}
                    onChange={handleInputChange}
                    className="block mt-1 text-sm w-full text-gray-600 border border-gray-300 rounded-md px-2 py-1"
                  />
                  {errorMessages.taxId && (
                    <p className="text-red-500 text-sm">{errorMessages.taxId}</p>
                  )}
                </>
              ) : (
                <p>{profile.taxId}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Years of Operation:</label>
              <p>{profile.yearsOfOperation}</p>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Summary</h3>
            
            <div>
              <label className="font-medium">Total Restaurants:</label>
              <p>{profile.totalRestaurants}</p>
            </div>
            <div>
              <label className="font-medium">Total Bookings:</label>
              <p>{profile.totalBookings}</p>
            </div>
            <div>
              <label className="font-medium">Average Rating:</label>
              <p>{profile.averageRating} ⭐</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setUpdatedProfile({ ...profile });
                  setIsEditing(false);
                  setErrorMessages({});
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Edit Profile
            </button>
          )}
        </div>
       </div>
     </div>
      
    </>
  );
};

export default OwnerProfile;


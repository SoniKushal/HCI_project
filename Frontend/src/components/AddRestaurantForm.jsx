import React, { useState } from 'react';


const AddRestaurantForm = ({ onClose , restaurantData = {}}) => {
  {console.log(restaurantData)}
  const [name, setName] = useState(restaurantData.name || '');
  const [location, setLocation] = useState(restaurantData.location || '');
  const [ambienceImages, setAmbienceImages] = useState(restaurantData.ambienceImages || []);
  const [menuImages, setMenuImages] = useState(restaurantData.menuImages || []);
  const [capacity, setCapacity] = useState(restaurantData.capacity || { twoPerson: 0, fourPerson: 0, sixPerson: 0 });
  const [cuisines, setCuisines] = useState(restaurantData.cuisines || []);
  const [openingHours, setOpeningHours] = useState(restaurantData.openingHours || { openHour: '00', openMinute: '00', closeHour: '00', closeMinute: '00' });
  const [phoneNumber, setPhoneNumber] = useState(restaurantData.phoneNumber || '');
  const [showPreview, setShowPreview] = useState(false); // State to control preview visibility
  const [showPreview1, setShowPreview1] = useState(false); // State to control preview visibility

  // State for modals
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [isCuisinesModalOpen, setIsCuisinesModalOpen] = useState(false);

  // Cuisines list
  const availableCuisines = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'Japanese'
  ];

  const handleSubmitCapacity = () => {
    setIsCapacityModalOpen(false);
  };

  const handleToggleCuisine = (cuisine) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter(c => c !== cuisine));
    } else {
      setCuisines([...cuisines, cuisine]);
    }
  };

  const handleSubmitCuisines = () => {
    setIsCuisinesModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to backend
    // const restaurantData = {
    //   name,
    //   location,
    //   image:ambienceImages,
    //   menuImage:menuImages,
    //   capacity,
    //   cuisines,
    //   openingHours,
    //   phoneNumber,
    // };
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('capacity', JSON.stringify(capacity));
    formData.append('cuisines', cuisines);
    formData.append('openingTime', `${openingHours.openHour}:${openingHours.openMinute}`);
    formData.append('closingTime', `${openingHours.closeHour}:${openingHours.closeMinute}`);
    formData.append('phoneNumber', phoneNumber);

    // Append image files
    ambienceImages.forEach((image) => {
      formData.append('image', image); // Assuming ambienceImages is an array of File objects
    });
    menuImages.forEach((menuImage) => {
      formData.append('menuImage', menuImage); // Assuming menuImages is an array of File objects
    });
    // Simulate sending data to backend (replace with your API call)
    //console.log('Submitting:', restaurantData);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/restaurant/addRestaurant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        //console.log('Restaurant added successfully');
        // Reset form fields after successful submission
        const resData = await response.json();
        
        const newRestaurant = {
          ...resData.restaurant,
          imageUrl: `http://localhost:4000/restaurant/images/${resData.restaurant.image[0]}`,
        };
        restaurantData(newRestaurant);
        setName('');
        setLocation('');
        setAmbienceImages([]);
        setMenuImages([]);
        setCapacity({ twoPerson: 0, fourPerson: 0, sixPerson: 0 });
        setCuisines([]);
        setOpeningHours({ openHour: '00', openMinute: '00', closeHour: '00', closeMinute: '00' });
        setPhoneNumber('');
        setShowPreview(false);
        setShowPreview1(false);

        // Close the form
        onClose();
      } else {
        console.error('Error adding restaurant:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding restaurant 1:', error);
    }
    // Reset form fields
    // setName('');
    // setLocation('');
    // setAmbienceImages([]);
    // setMenuImages([]);
    // setCapacity({ twoPerson: 0, fourPerson: 0, sixPerson: 0 });
    // setCuisines([]);
    // setOpeningHours({ openHour: '00', openMinute: '00', closeHour: '00', closeMinute: '00' });
    // setPhoneNumber('');
    // setShowPreview(false); // Hide preview on form reset
    // setShowPreview1(false); // Hide preview on form reset

    // // Close form after submission
    // onClose();
  };

  // Handle multiple ambience image upload and show preview button
  const handleAmbienceImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAmbienceImages((prevFiles) => [...prevFiles, ...files]);
    setShowPreview(files.length > 0); // Show preview button if files are uploaded
  };
  // Handle multiple menu image upload and show preview button
  const handleMenuImageChange = (e) => {
    const files = Array.from(e.target.files);
    setMenuImages((prevFiles) => [...prevFiles, ...files]);
    setShowPreview1(files.length > 0); // Show preview button if files are uploaded
  };

  return (
    <div className="fixed z-40 inset-0 mt-4 flex items-center justify-center bg-black bg-opacity-60 h-[100vh] overflow-y-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-50 rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2"
      >
        <div className="max-w-3xl mb-2 w-full relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute text-xl font-semibold top-2 right-2 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
          >
            ✕
          </button>
          <h2 className="mb-2 text-2xl font-semibold">Add Restaurant details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Side */}
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-xl">Restaurant Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md w-full p-2 shadow-md"
                required
              />
            </div>

            {/* Ambience Images Upload */}
            <div className="mb-4">
              <label className="block mb-2 text-xl">Ambience (Upload Images):</label>
              <input
                type="file"
                accept=".jpg,.png"
                multiple
                onChange={handleAmbienceImageChange}
                className="border rounded-md w-full p-2 bg-white shadow-md"
              />
              {/* Show total count next to the input button */}
              {ambienceImages.length > 0 && <p>{ambienceImages.length} files selected</p>}
            </div>

            {/* Show Preview Button if images are uploaded */}
            {ambienceImages.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="bg-accent text-white mb-2 px-3 py-2 rounded mt-1 hover:bg-green-500"
              >
                {showPreview ? 'Hide Uploaded Images' : 'Show Uploaded Images'}
              </button>
            )}
            {/* Image Preview Section */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full h-[80vh] overflow-y-auto p-6 relative">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
                  >
                    ✕
                  </button>
                  <h2 className="mb-2 text-xl font-semibold">Uploaded Images Preview:</h2>
                  <ul className="grid grid-cols-3 gap-4">
                    {ambienceImages.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <img

                          src={file instanceof File ? URL.createObjectURL(file) : file} // Use URL for existing images
                          alt={`Ambience ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-center mt-1">{file instanceof File ? file.name : `Image ${index + 1}`}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}


            <div className="mb-4">
              <label className="block mb-2 text-xl">Capacity:</label>
              {capacity.twoPerson + capacity.fourPerson + capacity.sixPerson > 0 ? (
                <button type="button" onClick={() => setIsCapacityModalOpen(true)} className="border rounded-md w-full p-2 text-left bg-white shadow-md grid grid-cols-2">
                  <div className='w-half'>
                    Total Tables: {capacity.twoPerson + capacity.fourPerson + capacity.sixPerson}
                  </div>
                  <div className='ml-1'>
                    Total Capacity: {capacity.twoPerson * 2 + capacity.fourPerson * 4 + capacity.sixPerson * 6}
                  </div>
                </button>
              ) : (
                <button type="button" onClick={() => setIsCapacityModalOpen(true)} className="border rounded-md w-full p-2 text-left shadow-md bg-white">
                  Select Capacity
                </button>
              )}
              {isCapacityModalOpen && (
                <div className="absolute bg-white border rounded-lg shadow-lg p-4 mt-2 z-10">
                  <h3 className="font-bold mb-2">Select Capacity</h3>
                  <div className="flex justify-between mb-4">
                    <span>2 Person Tables:</span>
                    <div>
                      <button type="button" onClick={() => setCapacity({ ...capacity, twoPerson: Math.max(0, capacity.twoPerson - 1) })} className="border px-2">−</button>
                      {capacity.twoPerson}
                      <button type="button" onClick={() => setCapacity({ ...capacity, twoPerson: capacity.twoPerson + 1 })} className="border px-2">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>4 Person Tables:</span>
                    <div>
                      <button type="button" onClick={() => setCapacity({ ...capacity, fourPerson: Math.max(0, capacity.fourPerson - 1) })} className="border px-2">−</button>
                      {capacity.fourPerson}
                      <button type="button" onClick={() => setCapacity({ ...capacity, fourPerson: capacity.fourPerson + 1 })} className="border px-2">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>6 Person Tables:</span>
                    <div>
                      <button type="button" onClick={() => setCapacity({ ...capacity, sixPerson: Math.max(0, capacity.sixPerson - 1) })} className="border px-2">−</button>
                      {capacity.sixPerson}
                      <button type="button" onClick={() => setCapacity({ ...capacity, sixPerson: capacity.sixPerson + 1 })} className="border px-2">+</button>
                    </div>
                  </div>

                  {/* Display Total Capacity */}
                  <h4>Total Tables: {capacity.twoPerson + capacity.fourPerson + capacity.sixPerson}</h4>
                  <h4>Total Capacity: {capacity.twoPerson * 2 + capacity.fourPerson * 4 + capacity.sixPerson * 6}</h4>

                  {/* Submit button for capacity */}
                  <button type="button" onClick={handleSubmitCapacity} className="bg-accent text-white rounded-md px-4 py-2 hover:bg-green-500 mt-2">
                    Submit Capacity
                  </button>
                </div>
              )}
            </div>

            {/* Opening / Closing Hours */}
            <div className="mb-4 flex space-x-4">
              <div className="flex flex-col w-full">
                <label className="block mb-2 text-xl">Opening Hours:</label>
                <input type="time" value={`${openingHours.openHour}:${openingHours.openMinute}`} onChange={(e) => {
                  const [hour, minute] = e.target.value.split(':');
                  setOpeningHours((prev) => ({ ...prev, openHour: hour, openMinute: minute }));
                }} required />
              </div>
              <div className="flex flex-col w-full">
                <label className="block mb-2 text-xl">Closing Hours:</label>
                <input type="time" value={`${openingHours.closeHour}:${openingHours.closeMinute}`} onChange={(e) => {
                  const [hour, minute] = e.target.value.split(':');
                  setOpeningHours((prev) => ({ ...prev, closeHour: hour, closeMinute: minute }));
                }} required />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-xl">Phone Number:</label>
              <input
                type="tel"
                pattern='[0-9]{10}'
                placeholder='+91 '
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-md w-full p-2 shadow-md"
                required
              />
            </div>

            {/* Menu Images Upload */}
            <div className="mb-4">
              <label className="block mb-2 text-xl">Menu (Upload Images):</label>
              <input
                type="file"
                accept=".jpg,.png"
                multiple
                onChange={handleMenuImageChange}
                className="border rounded-md w-full p-2 bg-white shadow-md"
              />
              {/* Show total count next to the input button */}
              {menuImages.length > 0 && <p>{menuImages.length} files selected</p>}
            </div>

            {/* Show Preview Button if images are uploaded */}
            {menuImages.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPreview1(!showPreview1)}
                className="bg-accent text-white mb-2 px-3 py-2 rounded mt-1 hover:bg-green-500"
              >
                {showPreview1 ? 'Hide Uploaded Images' : 'Show Uploaded Images'}
              </button>
            )}

            {/* Image Preview Section */}
            {showPreview1 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full h-[80vh] overflow-y-auto p-6 relative">
                  <button
                    type="button"
                    onClick={() => setShowPreview1(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
                  >
                    ✕
                  </button>
                  <h2 className="mb-2 text-xl font-semibold">Uploaded Images Preview:</h2>
                  <ul className="grid grid-cols-3 gap-4">
                    {menuImages.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <img
                          src={file instanceof File ? URL.createObjectURL(file) : file} // Use URL for existing images
                          alt={`Menu ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-center mt-1">{file instanceof File ? file.name : `Image ${index + 1}`}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}


            <div className="mb-4">
              <label className="block mb-2 text-xl">Cuisines:</label>
              <button
                type="button"
                onClick={() => setIsCuisinesModalOpen(true)}
                className="border rounded-md w-full p-2 text-left bg-white shadow-md"
              >
                {cuisines.length > 0 ? cuisines.join(', ') : 'Select Cuisines'}
              </button>
              {isCuisinesModalOpen && (
                <div className="absolute bg-white border rounded-lg shadow-lg p-4 mt-2 z-10">
                  <h3 className="font-bold mb-2">Select Cuisines</h3>
                  {/* Grid layout for cuisines */}
                  <div className='grid grid-cols-3 gap-x-4'>
                    {availableCuisines.map((cuisine) => (
                      <label key={cuisine} className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={cuisines.includes(cuisine)}
                          onChange={() => handleToggleCuisine(cuisine)}
                        />
                        {cuisine}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmitCuisines}
                    className="bg-accent text-white rounded-md px-4 py-2 hover:bg-green-500 mt-2"
                  >
                    Submit Cuisines
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-xl">Location:</label>
              <textarea
                rows={3}
                cols={40}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded-md w-full p-2 shadow-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-green-500 mt-4">
            Submit
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddRestaurantForm;



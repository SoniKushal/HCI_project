import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ name, address, rating, imageUrl, isOwner = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isOwner) {
      // Redirect to the OwnerRestaurant page for owners
      navigate('/ownerrestaurant');
    } else {
      // Redirect to the RestaurantDetails page for customers
      // Uncomment and replace with actual route when implementing
      // navigate('/restaurant-details');
      console.log('Redirect to Restaurant Details page for customers');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-72 h-72 m-2 shadow-lg rounded overflow-hidden cursor-pointer transition ease-in-out delay-150 hover:text-red-500 hover:scale-110 hover:border-2 hover:rounded border-red-500"
    >
      <div className="relative">
        {/* <img
          src={image || 'assets/restaurant-placeholder.jpg'}
          alt={name}
          className="w-full h-52 object-cover"
        /> */}
        <img src={imageUrl} alt={name} className="w-full h-52 object-cover" />
        {/* <span className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full">
          {rating} ★
        </span> */}
      </div>
      <div className="p-4">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurantId, name, address, imageUrl, isOwner = false }) => {
  const navigate = useNavigate();
  console.log(restaurantId, name, address, imageUrl, isOwner);
  const handleClick = () => {
    if (isOwner) {
      navigate(`/ownerrestaurant/${restaurantId}`);
    } else {
      navigate(`/reservations/${restaurantId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-72 h-72 m-2 shadow-lg rounded overflow-hidden cursor-pointer transition ease-in-out delay-150 hover:text-red-500 hover:scale-110 hover:border-2 hover:rounded border-red-500"
    >
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-52 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;

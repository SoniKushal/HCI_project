import React from 'react';

const CuisineList = ({ onCuisineSelect, selectedCuisine }) => {
  const cuisines = [
    { name: 'Italian', img: 'src/assets/italian.jpg' }, 
    { name: 'Chinese', img: 'src/assets/chinese.jpg' }, 
    { name: 'Indian', img: 'src/assets/indian.jpg' }, 
    { name: 'Mexican', img: 'src/assets/mexican.jpg' }, 
    { name: 'Japanese', img: 'src/assets/japanese.jpg' }, 
    { name: 'South Indian', img: 'src/assets/south-indian.jpg' }
  ];

  return (
    <div className="my-8 px-10">
      <h2 className="text-2xl mb-4">Popular Cuisines</h2>
      <div className="flex items-center justify-between text-xl overflow-x-auto">
        {cuisines.map((cuisine) => (
          <div
            key={cuisine.name}
            onClick={() => onCuisineSelect(cuisine.name)}
            className={`bg-gray-100 shadow-md p-3 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center flex-shrink-0 mx-2
              ${selectedCuisine === cuisine.name ? 'border-2 border-orange-500' : ''}`}
            style={{ minWidth: '160px' }}
          >
            <img src={cuisine.img} alt={cuisine.name} className="w-10 h-10 rounded-full" />
            <div className="ml-2 truncate">
              {cuisine.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisineList;
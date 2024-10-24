import React from 'react';

const CuisineList = () => {
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
      <div className="flex items-center justify-center text-xl">
        {cuisines.map((cuisine) => (
          <div
            key={cuisine.name}
            className="bg-gray-100 shadow-md p-4 m-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center"
            style={{ width: '20%' }} // Two items per row with some spacing
          >
            <img src={cuisine.img} alt={cuisine.name} className="w-12 h-12 mr-2 rounded-full" /> {/* Placeholder for images */}
            <div className="ml-3">
              {cuisine.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisineList;
import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa'; // Import necessary icons

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-[100] ml-0 lg:ml-64 p-4 flex justify-between items-center bg-gray-100"> 
      
      {/* Hamburger Menu for Mobile */}
      <button onClick={toggleSidebar} className="lg:hidden  text-red-600 w-[30px] h-[30px] ">
        <FaBars size={30} />
      </button>

      {/* Search Input */}
      <div className="relative mx-auto w-80 max-w-xs"> 
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-md w-full py-[6px] px-[10px] pl-[30px] focus:outline-none focus:ring focus:ring-red-500"
        />
        <FaSearch className="absolute left-[10px] top-[10px] text-red-500" />
      </div>

      {/* Notification and Profile Icons */}
      <div className="flex items-center justigy-between">
        <div className="relative mx-[15px]">
          <FaBell className="text-gray-600 w-[30px] h-[30px] cursor-pointer hover:text-red-500 " />
        </div>
        <div className="relative mx-auto">
          {/* <FaUserCircle className="cursor-pointer w-[40px] h-[40px] text-gray-600 hover:text-red-500" /> */}
          <img src="src/assets/pfp.jpg" alt="profile" className="w-[40px] h-[40px] rounded-full cursor-pointer hover:ring-2 ring-red-500"/>
        </div>
      </div>
    </header>
  );
};

export default Header;
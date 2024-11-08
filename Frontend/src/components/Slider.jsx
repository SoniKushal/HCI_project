import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const OfferSlider = ({ images, slidesToShow = 1 }) => {
  const settings = {
    dots: true,
    infinite: true, 
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  //console.log("Slider Images:", images); // Log the images for debugging
  return (
    <Slider {...settings} className='z-0'>
      {images.map((image,index) => (
        <div key={`${image}-${index}`}>
          <img src={`http://localhost:4000/restaurant/images/${image}`} alt={`Offer ${image}`} className="w-full h-80 object-cover" />
          {/* {console.log(image)} */}
        </div>
      ))}
    </Slider>
  );
};

// Custom next arrow component
const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
};

// Custom previous arrow component
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute z-50 left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

export default OfferSlider;

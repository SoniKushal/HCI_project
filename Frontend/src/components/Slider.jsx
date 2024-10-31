import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for arrows

const OfferSlider = ({ images, slidesToShow = 1 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    position : 'z-0',
    slidesToShow: slidesToShow, // Use the slidesToShow prop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Slider {...settings} className='z-0'>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Offer ${index + 1}`} className="w-full h-80 object-cover" />
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

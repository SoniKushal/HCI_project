import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for arrows

// Import images
import offer1 from '../assets/offer1.jpg';
import offer2 from '../assets/offer2.jpg';
import offer3 from '../assets/offer3.jpg';
import offer4 from '../assets/offer4.jpg';



const OfferSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Slider {...settings} >
      <div>
        <img src={offer1} alt="Offer 1" className="w-full h-80" />
      </div>
      <div>
        <img src={offer2} alt="Offer 2" className="w-full h-80" />
      </div>
      <div>
        <img src={offer3} alt="Offer 3" className="w-full h-80" />
      </div>
      <div>
        <img src={offer4} alt="Offer 4" className="w-full h-80" />
      </div>
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
      className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

export default OfferSlider;
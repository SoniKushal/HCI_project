import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const OfferSlider = ({ 
  images, 
  slidesToShow = 1, 
  width = 'w-full', // Default to full width, but customizable
  maxWidth = 'max-w-6xl' // Added max-width for responsiveness
}) => {
  const settings = {
    dots: true,
    infinite: true, 
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.max(1, slidesToShow - 1),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={`mx-auto px-4 md:px-10 mb-8 ${width} ${maxWidth} mx-auto`}>
      <Slider {...settings} className='z-0'>
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="px-1">
            <div className="aspect-w-16 aspect-h-6">
              <img 
                src={`${image}`} 
                alt={`Offer ${index + 1}`} 
                className="w-full h-[400px] object-contain rounded-lg"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom arrow components with improved visibility
const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
      onClick={onClick}
    >
      <FaArrowRight className="text-gray-800" />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
      onClick={onClick}
    >
      <FaArrowLeft className="text-gray-800" />
    </div>
  );
};

export default OfferSlider;
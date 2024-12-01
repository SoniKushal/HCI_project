import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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

const MenuSlider = (images) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src={offer1} alt="Menu Item 1" className="w-full h-40" />
      </div>
      <div>
        <img src={offer2} alt="Menu Item 2" className="w-full h-40" />
      </div>
      <div>
        <img src={offer3} alt="Menu Item 3" className="w-full h-40" />
      </div>
      <div>
        <img src={offer4} alt="Menu Item 4" className="w-full h-40" />
      </div>
    </Slider>
  );
};

export default MenuSlider;
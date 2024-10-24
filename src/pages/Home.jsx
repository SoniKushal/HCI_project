import React from 'react';
import Header from '../components/Header';
import OffersSlider from '../components/Slider';
import CuisineList from '../components/CuisineList';
import RestaurantCard from '../components/RestaurantCard';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for arrows
import Slider from 'react-slick'; // Import Slider from react-slick

const Home = () => {
  const restaurants = [
    {
      id: 1,
      name: 'The Spice Room',
      address: '123 Main Street, City',
      rating: 4.5,
      image: 'src/assets/restaurant1.jpg',
    },
    {
      id: 2,
      name: 'La Piazza',
      address: '456 Elm Street, City',
      rating: 4.7,
      image: 'src/assets/restaurant2.jpg',
    },
    {
      id: 3,
      name: 'Sushi World',
      address: '789 Ocean Drive, City',
      rating: 4.8,
      image: 'src/assets/restaurant1.jpg',
    },
    {
      id: 4,
      name: 'Burger Haven',
      address: '321 Burger Lane, City',
      rating: 4.6,
      image: 'src/assets/restaurant2.jpg',
    },
    {
      id: 5,
      name: 'Pasta Palace',
      address: '654 Pasta Road, City',
      rating: 4.9,
      image: 'src/assets/restaurant1.jpg',
    },
    {
      id: 6,
      name: 'Taco Town',
      address: '987 Taco Way, City',
      rating: 4.7,
      image: 'src/assets/restaurant2.jpg',
    },
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of cards to show at once
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show two cards on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show one card on small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="p-4 bg-background">
        <OffersSlider />
        <CuisineList className='px-4'/>
        <section className="mt-8 px-10">
          <h2 className="text-2xl mb-4">Restaurants Near You</h2>
          <div className="overflow-hidden">
            <Slider {...settings}>
              {restaurants.map((restaurant) => (
                <div key={restaurant.id}>
                  <RestaurantCard {...restaurant} />
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
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
      className="absolute z-10 pr-2 left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

export default Home;
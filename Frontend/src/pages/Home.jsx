import React , {useState,useEffect} from 'react';
import Header from '../components/Header';
import OfferSlider from '../components/Slider';
import CuisineList from '../components/CuisineList';
import RestaurantCard from '../components/RestaurantCard';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Icons for arrows
import Slider from 'react-slick'; // Import Slider from react-slick
import axios from 'axios';

const offers = [
 'src/assets/offer1.jpg',
'src/assets/offer2.jpg',
 'src/assets/offer3.jpg',
 'src/assets/offer4.jpg',
]

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:4000/restaurant/allRestaurantForCustomer',{
          headers: {
            Authorization: `Bearer ${token}`
          }
       });
        console.log(response);
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);
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
        <OfferSlider images={offers}/>
        <CuisineList className='px-4'/>
        <section className="mt-8 px-10">
          <h2 className="text-2xl mb-4">Restaurants Near You</h2>
          <div className="overflow-hidden">
            <Slider {...settings}>
              {restaurants.map((restaurant) => (
                <div key={restaurant._id}>
                  <RestaurantCard 
                    id={restaurant._id}
                    name={restaurant.name}
                    address={restaurant.location}
                    imageUrl={`http://localhost:4000/restaurant/images/${restaurant.image[0]}`}
                  />
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
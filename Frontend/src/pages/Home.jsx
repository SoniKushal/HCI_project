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
  'src/assets/o1.jpg',
'src/assets/o2.png',
  'src/assets/o3.jpg',
  'src/assets/offer7.png',
  'src/assets/offer6.png'
]

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const token = localStorage.getItem('token');

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurant/allRestaurantForCustomer`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRestaurants(response.data.restaurants);
        setFilteredRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = restaurants;

    // Filter by location
    if (selectedLocation) {
      result = result.filter(restaurant => 
        restaurant.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by search term (restaurant name)
    if (searchTerm) {
      result = result.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisine
    if (selectedCuisine) {
      result = result.filter(restaurant =>
        restaurant.cuisines.includes(selectedCuisine)
      );
    }

    setFilteredRestaurants(result);
  }, [selectedLocation, searchTerm, selectedCuisine, restaurants]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine === selectedCuisine ? '' : cuisine);
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, filteredRestaurants.length),
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredRestaurants.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header 
        onLocationChange={handleLocationChange}
        onSearchChange={handleSearchChange}
      />
      <main className="p-4 bg-background">
        <OfferSlider images={offers}/>
        <CuisineList 
          onCuisineSelect={handleCuisineSelect}
          selectedCuisine={selectedCuisine}
        />
        <section className="mt-8 px-10">
          <h2 className="text-2xl mb-4">
            {filteredRestaurants.length === 0 
              ? "No restaurants found" 
              : "Restaurants Near You"}
          </h2>
          <div className="overflow-hidden">
            <Slider {...settings}>
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant._id}>
                  <RestaurantCard 
                    restaurantId={restaurant._id}
                    name={restaurant.name}
                    address={restaurant.location}
                    imageUrl={`${import.meta.env.VITE_BACKEND_URL}/restaurant/images/${restaurant.image[0]}`}
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
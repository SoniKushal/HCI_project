import React, { useState, useEffect } from 'react';
import { useNavigate, Link,useLocation,useSearchParams } from 'react-router-dom';
import foodImage from "/src/assets/indian.jpg";
import backgroundImage from "/src/assets/Untitled.png";
import googleLogo from '/src/assets/google.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../components/auth-context';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isOwner: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Handle Google OAuth redirect
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const type = searchParams.get('type');

    if (error) {
      alert(error);
      return;
    }

    if (token) {
      login(token);
      try {
        // Decode the JWT to get user information
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        // Check if the user is an owner
        const isOwner = payload.isOwner;
        
        // Redirect based on user type
        if (isOwner) {
          navigate('/ownerdashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        alert('An error occurred during login');
      }
    }
  }, [searchParams, login, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTabClick = (isOwner) => {
    setFormData({
      ...formData,
      isOwner,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
  
    try {
    
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        login(data.token);
        toast.success('Successfully logged in!');
        if (formData.isOwner) {
          navigate('/ownerdashboard');
        } else {
          navigate('/');
        }
      } else {
        const error = await response.json();
        console.error('Error during login:', error.message);
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div
      className="flex items-center justify-center py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg flex overflow-hidden"
        style={{ width: '700px', minHeight: '80vh' }}
      >
        <div className="w-5/12 p-4 flex flex-col justify-center" style={{ backgroundColor: '#FFC300' }}>
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">Sign in</h2>
            <p className="text-lg text-gray-500">Sign in to continue</p>
          </div>

          <div className="flex justify-between border-b-2 mb-4">
            <button
              className={`flex-1 text-center py-2 font-bold ${
                !formData.isOwner ? 'text-blue-600 border-b-4 border-blue-600' : 'text-black'
              }`}
              onClick={() => handleTabClick(false)}
            >
              Sign in as <br /> Customer
            </button>
            <button
              className={`flex-1 text-center py-2 font-bold ${
                formData.isOwner ? 'text-blue-600 border-b-4 border-blue-600' : 'text-black'
              }`}
              onClick={() => handleTabClick(true)}
            >
              Sign in as <br /> Owner
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-lg"
              placeholder="Email"
              autoComplete="off"
              required
            />
            {errors.email && <p className="text-red-600">{errors.email}</p>}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-lg"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600">{errors.password}</p>}

            <div className="text-left mb-4">
              <Link to="/forgotpassword" className="text-red-500 text-sm hover:underline cursor-pointer">Forgot Password</Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google?type=${formData.isOwner}`;
              }}
              className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              <img src={googleLogo} alt="Google Logo" className="w-5 h-auto mr-2" />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-gray-600 text-lg mt-3">
              Don't have an account?{' '}
              <Link to="/signup" className="text-black font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="w-7/12 relative bg-orange-100">
          <img src={foodImage} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
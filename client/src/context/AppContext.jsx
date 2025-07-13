import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from '../api/api.js'; // ✅ import shared API instance

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/user/data'); // ✅ uses shared instance
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await api.get('/api/user/cars'); // ✅ uses shared instance
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    api.defaults.headers.common['Authorization'] = ''; // ✅ clear auth header
    toast.success('You have been logged out');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    fetchCars();
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `${token}`; // ✅ set token header
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate, currency, user, setUser,
    token, setToken, isOwner, setIsOwner,
    fetchUser, showLogin, setShowLogin,
    logout, fetchCars, cars, setCars,
    pickupDate, setPickupDate,
    returnDate, setReturnDate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

import { createContext, useContext, useState, useEffect } from 'react';

export const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [searchCity, setSearchCity] = useState('New York');
  
  const [favorites, setFavorites] = useState([
    {
      city: "New York",
      country: "United States",
      condition: "Partly Cloudy",
      temperature: "72°",
      isDefault: true,
      icon: "cloud"
    }
  ]);
  
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [aiTone, setAiTone] = useState("Casual");
  
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleSearch = (city) => {
    setSearchCity(city);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const addToFavorites = (location) => {
    if (location.removeExisting) {
      const index = favorites.findIndex(fav => 
        fav.city.toLowerCase() === location.city.toLowerCase()
      );
      
      if (index !== -1) {
        removeFromFavorites(index);
        return true;
      }
      return false;
    } else {
      const exists = favorites.some(fav => 
        fav.city.toLowerCase() === location.city.toLowerCase()
      );
      
      if (!exists) {
        const isDefault = favorites.length === 0;
        
        const newFavorite = {
          ...location,
          isDefault
        };
        
        setFavorites(prev => [...prev, newFavorite]);
        return true;
      }
      return false;
    }
  };

  const removeFromFavorites = (index) => {
    const updatedFavorites = [...favorites];
    const wasDefault = updatedFavorites[index].isDefault;
    
    updatedFavorites.splice(index, 1);
    
    if (wasDefault && updatedFavorites.length > 0) {
      updatedFavorites[0].isDefault = true;
    }
    
    setFavorites(updatedFavorites);
  };

  const setDefaultLocation = (index) => {
    const updatedFavorites = favorites.map((location, i) => ({
      ...location,
      isDefault: i === index
    }));
    setFavorites(updatedFavorites);
  };

  const isLocationFavorite = (cityName) => {
    return favorites.some(fav => 
      fav.city.toLowerCase() === cityName.toLowerCase()
    );
  };
  
  const handleCityChange = (city) => {
    setSearchCity(city);
    if (currentPage === 'favorites') {
      setCurrentPage('dashboard');
    }
  };

  const updateSettings = (updates) => {
    if ('temperatureUnit' in updates) {
      setTemperatureUnit(updates.temperatureUnit);
      localStorage.setItem('temperatureUnit', updates.temperatureUnit);
    }
    if ('darkMode' in updates) {
      setDarkMode(updates.darkMode);
      localStorage.setItem('darkMode', updates.darkMode);
      
      // Apply dark mode to document body
      if (updates.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    if ('defaultLocation' in updates && typeof updates.defaultLocation === 'string') {
      // Handle default location change
      if (updates.defaultLocation) {
        const [city, country] = updates.defaultLocation.split(', ');
        handleCityChange(city);
      }
    }
    if ('notifications' in updates) {
      setNotifications(updates.notifications);
      localStorage.setItem('notifications', updates.notifications);
    }
    if ('aiTone' in updates) {
      setAiTone(updates.aiTone);
      localStorage.setItem('aiTone', updates.aiTone);
    }
  };

  useEffect(() => {
    const savedTemperatureUnit = localStorage.getItem('temperatureUnit');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedNotifications = localStorage.getItem('notifications');
    const savedAiTone = localStorage.getItem('aiTone');
    const savedFavorites = localStorage.getItem('weatherFavorites');
    
    if (savedTemperatureUnit) setTemperatureUnit(savedTemperatureUnit);
    if (savedDarkMode) {
      const isDarkMode = savedDarkMode === 'true';
      setDarkMode(isDarkMode);
      
      // Apply dark mode to document on initial load
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    if (savedNotifications) setNotifications(savedNotifications !== 'false');
    if (savedAiTone) setAiTone(savedAiTone);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const contextValue = {
    searchCity,
    favorites,
    temperatureUnit,
    darkMode,
    notifications,
    aiTone,
    currentPage,
    
    setSearchCity,
    handleSearch,
    navigateTo,
    addToFavorites,
    removeFromFavorites,
    setDefaultLocation,
    isLocationFavorite,
    handleCityChange,
    updateSettings
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};
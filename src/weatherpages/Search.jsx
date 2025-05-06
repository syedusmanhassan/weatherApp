import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Star, Search } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext"

export default function SearchComponent() {
 
  const {
    searchCity,
    handleSearch,
    addToFavorites,
    isLocationFavorite
  } = useWeather();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({
    condition: "Partly Cloudy",
    temperature: "72°",
    icon: "cloud"  
  });
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  

  const isFavorite = searchCity ? isLocationFavorite(searchCity) : false;
  
  const predefinedLocations = [
    { city: "New York", country: "United States" },
    { city: "London", country: "United Kingdom" },
    { city: "Tokyo", country: "Japan" },
    { city: "Paris", country: "France" },
    { city: "Sydney", country: "Australia" },
    { city: "Berlin", country: "Germany" },
    { city: "Toronto", country: "Canada" },
    { city: "Singapore", country: "Singapore" }
  ];

 
  useEffect(() => {
    if (searchCity) {
      // Extract just the city name if it contains a comma
      const cityName = searchCity.split(',')[0].trim();
      setSearchTerm(cityName);
    }
  }, [searchCity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (searchCity) {
   
      const getWeatherInfo = () => {
        const cityLower = searchCity.toLowerCase();
        
        if (cityLower.includes('london')) {
          return { condition: "Cloudy", temperature: "62°", icon: "cloud" };
        } else if (cityLower.includes('tokyo')) {
          return { condition: "Sunny", temperature: "75°", icon: "sun" };
        } else if (cityLower.includes('paris')) {
          return { condition: "Rainy", temperature: "68°", icon: "cloud-rain" };
        } else if (cityLower.includes('sydney')) {
          return { condition: "Sunny", temperature: "81°", icon: "sun" };
        } else if (cityLower.includes('berlin')) {
          return { condition: "Partly Cloudy", temperature: "65°", icon: "cloud" };
        } else if (cityLower.includes('toronto')) {
          return { condition: "Snowy", temperature: "28°", icon: "cloud" };
        } else if (cityLower.includes('singapore')) {
          return { condition: "Thunderstorms", temperature: "85°", icon: "cloud-rain" };
        } else {
          return { condition: "Partly Cloudy", temperature: "72°", icon: "cloud" };
        }
      };
      
      setWeatherInfo(getWeatherInfo());
    }
  }, [searchCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim());
      setShowDropdown(false);
    }
  };

  const handleLocationSelect = (location) => {
    const fullLocation = `${location.city}, ${location.country}`;
    setSearchTerm(location.city);
    handleSearch(fullLocation);
    setShowDropdown(false);
  };

  const handleAddToFavorites = () => {
    if (!searchCity) return;
    
    if (isFavorite) {
   
      const cityName = searchCity.split(',')[0].trim();
      addToFavorites({
        city: cityName,
        removeExisting: true
      });
    } else {
    
      const parts = searchCity.split(',').map(part => part.trim());
      const city = parts[0];
      const country = parts.length > 1 ? parts[1] : "Unknown";
      
      const location = {
        city,
        country,
        condition: weatherInfo.condition,
        temperature: weatherInfo.temperature,
        icon: weatherInfo.icon,
        removeExisting: false
      };
      
      addToFavorites(location);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-md p-4">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          ref={inputRef}
          placeholder="Search location..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full py-2.5 pl-10 pr-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {predefinedLocations.map((location, index) => (
              <div 
                key={index}
                className="flex items-center px-3 py-2.5 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">{location.city} </span>
                  <span className="text-gray-500">{location.country}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        className={`p-2.5 border ${isFavorite ? 'bg-yellow-50 border-yellow-300 text-yellow-600' : 'border-gray-300 text-gray-500 hover:bg-gray-100'} rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={handleAddToFavorites}
        disabled={!searchCity}
      >
        <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
      </button>
    </div>
  );
}
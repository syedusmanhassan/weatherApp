import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Star, Search } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext"

export default function SearchComponent() {
 
  const {
    searchCity,
    handleSearch,
    addToFavorites,
    isLocationFavorite,
    darkMode,
  } = useWeather();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({
    condition: "Partly Cloudy",
    temperature: "72°",
    icon: "cloud"  
  });
  const [currentCountry, setCurrentCountry] = useState('');
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
    { city: "Singapore", country: "Singapore" },
    { city: "Karachi", country: "Pakistan" } // Added Karachi with proper country
  ];

  // Set search term when city changes
  useEffect(() => {
    if (searchCity) {
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

  // Helper function to determine the icon type based on weather code
  const getWeatherIconType = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) {
      return "cloud-rain"; // Thunderstorm
    } else if (weatherCode >= 300 && weatherCode < 600) {
      return "cloud-rain"; // Drizzle and Rain
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return "cloud"; // Snow
    } else if (weatherCode === 800) {
      return "sun"; // Clear sky
    } else if (weatherCode > 800) {
      return "cloud"; // Clouds
    } else {
      return "cloud"; // Default
    }
  };

  useEffect(() => {
    if (searchCity) {
      const cityName = searchCity.split(',')[0].trim();
      // Fetch real weather data from API for any city
      fetchWeatherData(cityName);
    }
  }, [searchCity]);
  
  // Function to convert country code to full name
  const getCountryName = (countryCode) => {
    const countries = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'JP': 'Japan',
      'FR': 'France',
      'AU': 'Australia',
      'DE': 'Germany',
      'CA': 'Canada',
      'SG': 'Singapore',
      'PK': 'Pakistan',
      'IN': 'India',
      'CN': 'China',
      'RU': 'Russia',
      'BR': 'Brazil',
      'ES': 'Spain',
      'IT': 'Italy',
      'NL': 'Netherlands',
      'MX': 'Mexico',
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'EG': 'Egypt',
      'ZA': 'South Africa',
      'AR': 'Argentina',
      'TH': 'Thailand',
      'ID': 'Indonesia',
      'MY': 'Malaysia',
      'KR': 'South Korea',
      'NG': 'Nigeria',
      'VN': 'Vietnam',
      'PH': 'Philippines',
      'BD': 'Bangladesh',
      // Add more country mappings as needed
    };
    
    return countries[countryCode] || countryCode;
  };

  // Function to fetch weather data
  const fetchWeatherData = async (cityName) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      // Update country from API - convert country code to full name
      if (data.sys && data.sys.country) {
        const countryName = getCountryName(data.sys.country);
        setCurrentCountry(countryName);
      }
      
      // Update weather info from API
      if (data.weather && data.weather.length > 0) {
        setWeatherInfo({
          condition: data.weather[0].main,
          temperature: `${Math.round(data.main.temp)}°F`,
          icon: getWeatherIconType(data.weather[0].id)
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Fallback to default weather info if API fails
      setWeatherInfo({
        condition: "Partly Cloudy",
        temperature: "72°",
        icon: "cloud"
      });
    }
  };

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
    setCurrentCountry(location.country);
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
      const cityName = searchCity.split(',')[0].trim();
      // Use the country from our state which is populated from the API
      const country = currentCountry || "Unknown";
      
      // Create the location object with all required fields
      const location = {
        city: cityName,
        country: country,
        condition: weatherInfo.condition,
        temperature: weatherInfo.temperature,
        icon: weatherInfo.icon,
        removeExisting: false
      };
      
      console.log("Adding to favorites:", location); // For debugging
      addToFavorites(location);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-md p-4">
      <div className="relative flex-1">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          ref={inputRef}
          placeholder="Search location..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className={`w-full py-2.5 pl-10 pr-4 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } border rounded-lg focus:outline-none focus:ring-2 transition-all`}
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
            className={`absolute z-10 w-full mt-1 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200'
            } border rounded-lg shadow-lg overflow-hidden`}
          >
            {predefinedLocations.map((location, index) => (
              <div 
                key={index}
                className={`flex items-center px-3 py-2.5 cursor-pointer ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <span className="font-medium">{location.city} </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{location.country}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        className={`p-2.5 border ${
          isFavorite 
            ? darkMode 
              ? 'bg-yellow-900/30 border-yellow-700 text-yellow-500' 
              : 'bg-yellow-50 border-yellow-300 text-yellow-600'
            : darkMode 
              ? 'border-gray-700 text-gray-400 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-500 hover:bg-gray-100'
        } rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={handleAddToFavorites}
        disabled={!searchCity}
      >
        <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
      </button>
    </div>
  );
}
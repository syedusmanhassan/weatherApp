import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext"

export default function WeatherCard() {
  const { 
    searchCity, 
    temperatureUnit,
    handleCityChange 
  } = useWeather();
  
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCity, setDisplayCity] = useState(searchCity);

  useEffect(() => {
    setDisplayCity(searchCity);
  }, [searchCity]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${displayCity}&units=imperial&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [displayCity]);

  const handleCityInputChange = (e) => {
    if (e.key === 'Enter') {
      const newCity = e.target.value;
      setDisplayCity(newCity);
      
      handleCityChange(newCity);
    }
  };

  const convertTemperature = (fahrenheit) => {
    if (temperatureUnit === "celsius") {
      return Math.round((fahrenheit - 32) * 5 / 9);
    }
    return Math.round(fahrenheit);
  };

  const getTemperatureSymbol = () => {
    return temperatureUnit === "celsius" ? "°C" : "°F";
  };

  const getWeatherIconName = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return "lightning";
    if (weatherCode >= 300 && weatherCode < 600) return "rain";
    if (weatherCode >= 600 && weatherCode < 700) return "snow";
    if (weatherCode >= 700 && weatherCode < 800) return "fog";
    if (weatherCode === 800) return "sun";
    return "cloud";
  };

  const getWeatherIcon = (weatherCode) => {
    if (!weatherCode) return <Cloud className="h-10 w-10 text-sky-500" />;
    
    if (weatherCode >= 200 && weatherCode < 300) {
      return <CloudLightning className="h-10 w-10 text-purple-500" />; 
    } else if (weatherCode >= 300 && weatherCode < 600) {
      return <CloudRain className="h-10 w-10 text-blue-500" />; 
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return <CloudSnow className="h-10 w-10 text-blue-200" />;
    } else if (weatherCode >= 700 && weatherCode < 800) {
      return <CloudFog className="h-10 w-10 text-gray-400" />; 
    } else if (weatherCode === 800) {
      return <Sun className="h-10 w-10 text-yellow-500" />; 
    } else {
      return <Cloud className="h-10 w-10 text-sky-500" />; 
    }
  };

  const getWeatherAdvice = (data) => {
    if (!data) return "";
    
    const temp = temperatureUnit === "celsius" 
      ? convertTemperature(data.main.temp)
      : data.main.temp;
    const weather = data.weather[0].main.toLowerCase();
    
    const isHot = temperatureUnit === "celsius" ? temp > 29 : temp > 85;
    const isCold = temperatureUnit === "celsius" ? temp < 4 : temp < 40;
    const isIdeal = temperatureUnit === "celsius" 
      ? (temp >= 18 && temp <= 27)
      : (temp >= 65 && temp <= 80);
    
    if (weather.includes("rain") || weather.includes("drizzle")) {
      return "Don't forget your umbrella today! ☔";
    } else if (weather.includes("snow")) {
      return "Bundle up! It's snowing outside. ❄️";
    } else if (weather.includes("thunder") || weather.includes("storm")) {
      return "Stormy weather ahead. Best to stay indoors! ⚡";
    } else if (isHot) {
      return "It's hot out there! Stay hydrated and find some shade. 🥤";
    } else if (isCold) {
      return "Brrr, it's cold! Bundle up with extra layers. 🧣";
    } else if (isIdeal && (weather.includes("clear") || weather.includes("cloud"))) {
      return "Perfect day for outdoor activities! Enjoy the weather! 🌳";
    } else {
      return "Have a great day, whatever your plans! 😊";
    }
  };

  const WeatherStat = ({ icon, label, value }) => {
    return (
      <div className="flex flex-col items-center rounded-lg bg-gray-100/50 p-2 ">
        {icon}
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-6 w-full flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-6 w-full dark:bg-gray-800 dark:border-gray-700">
        <p className="text-red-500">{error}</p>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter city name"
            className="w-full p-2 border rounded"
            defaultValue={displayCity}
            onKeyDown={handleCityInputChange}
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter to search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white w-full overflow-hidden ">
      {/* Header section */}
      {weatherData && (
        <>
          <div className="p-6 pb-2">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {weatherData.name}, {weatherData.sys.country}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-6 pt-0">
            <div className="flex items-center justify-between">
              {getWeatherIcon(weatherData.weather[0].id)}
              <div className="text-4xl font-bold">
                {convertTemperature(weatherData.main.temp)}{getTemperatureSymbol()}
              </div>
            </div>
            
            <div className="mt-4 rounded-lg bg-sky-50 p-3 ">
              <p className="text-sm">
                <span className="font-medium">Weather advice:</span> {getWeatherAdvice(weatherData)}
              </p>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <WeatherStat 
                icon={<Thermometer className="mb-1 h-5 w-5 text-orange-500" />}
                label="Feels like"
                value={`${convertTemperature(weatherData.main.feels_like)}${getTemperatureSymbol()}`}
              />
              <WeatherStat 
                icon={<Droplets className="mb-1 h-5 w-5 text-blue-500" />}
                label="Humidity"
                value={`${weatherData.main.humidity}%`}
              />
              <WeatherStat 
                icon={<Wind className="mb-1 h-5 w-5 text-sky-500" />}
                label="Wind"
                value={`${Math.round(weatherData.wind.speed)} mph`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
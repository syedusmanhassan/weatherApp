import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext";

export function Forecast() {
  const {searchCity, temperatureUnit} = useWeather();

  const [activeTab, setActiveTab] = useState("forecast");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
       
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=imperial&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error("Weather data not available");
        }
        
        const data = await response.json();
        
        // Process the forecast data
        const processedForecast = processForecastData(data);
        setForecast(processedForecast);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again later.");
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity]);

  // Process the raw forecast data to get daily forecasts
  const processForecastData = (data) => {
    const dailyForecasts = [];
    const forecastsByDay = {};
    
    // Group forecasts by day
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toDateString();
      
      if (!forecastsByDay[day]) {
        forecastsByDay[day] = [];
      }
      
      forecastsByDay[day].push(item);
    });
    
    // Get min and max temps for each day
    Object.keys(forecastsByDay).forEach((day, index) => {
      if (index < 3) { // Only take the first 3 days
        const forecasts = forecastsByDay[day];
        const temps = forecasts.map(f => f.main.temp);
        const high = Math.round(Math.max(...temps));
        const low = Math.round(Math.min(...temps));
        
        // Get the most common weather condition for the day
        const conditions = forecasts.map(f => f.weather[0].main);
        const mostCommonCondition = getMostCommonItem(conditions);
        
        const date = new Date(forecasts[0].dt * 1000);
        const dayName = index === 0 ? "Today" : 
                        index === 1 ? "Tomorrow" : 
                        date.toLocaleDateString('en-US', { weekday: 'long' });
        
        dailyForecasts.push({
          day: dayName,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          condition: mostCommonCondition,
          high,
          low,
          details: {
            humidity: Math.round(forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length),
            windSpeed: Math.round(forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / forecasts.length),
            description: forecasts[0].weather[0].description,
            pressure: Math.round(forecasts.reduce((sum, f) => sum + f.main.pressure, 0) / forecasts.length)
          }
        });
      }
    });
    
    return dailyForecasts;
  };

  // Helper function to get the most common item in an array
  const getMostCommonItem = (arr) => {
    const counts = {};
    let maxCount = 0;
    let mostCommon;
    
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostCommon = item;
      }
    }
    
    return mostCommon;
  };

  // Convert temperature based on user preference
  const convertTemperature = (fahrenheit) => {
    if (temperatureUnit === "celsius") {
      // Convert Fahrenheit to Celsius: (F - 32) * 5/9
      return Math.round((fahrenheit - 32) * 5 / 9);
    }
    return Math.round(fahrenheit);
  };

  // Get the temperature unit symbol
  const getTemperatureSymbol = () => {
    return temperatureUnit === "celsius" ? "°C" : "°F";
  };

  // Function to determine which weather icon to use
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "Rain":
      case "Drizzle":
        return <CloudRain className="h-8 w-8 text-sky-500" />;
      case "Snow":
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case "Thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case "Mist":
      case "Fog":
      case "Haze":
        return <CloudFog className="h-8 w-8 text-gray-400" />;
      case "Clouds":
      default:
        return <Cloud className="h-8 w-8 text-sky-500" />;
    }
  };

  return (
    <div className="w-full">
      {/* Simple Tabs */}
      <div className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("forecast")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "forecast"
              ? "bg-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Forecast
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "details"
              ? "bg-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        ) : (
          <>
            {activeTab === "forecast" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {forecast && forecast.map((day, index) => (
                  <ForecastCard
                    key={index}
                    day={day.day}
                    date={day.date}
                    icon={getWeatherIcon(day.condition)}
                    high={convertTemperature(day.high)}
                    low={convertTemperature(day.low)}
                    temperatureSymbol={getTemperatureSymbol()}
                  />
                ))}
              </div>
            )}
            {activeTab === "details" && forecast && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 font-medium">Detailed Weather Information</h3>
                <div className="space-y-3">
                  {forecast.map((day, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(day.condition)}
                          <div>
                            <p className="font-medium">{day.day}</p>
                            <p className="text-xs text-gray-500">{day.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{convertTemperature(day.high)}{getTemperatureSymbol()}</span>
                          <span className="text-sm text-gray-500">{convertTemperature(day.low)}{getTemperatureSymbol()}</span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Humidity: </span>
                          <span>{day.details.humidity}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Wind: </span>
                          <span>{day.details.windSpeed} mph</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition: </span>
                          <span className="capitalize">{day.details.description}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pressure: </span>
                          <span>{day.details.pressure} hPa</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ForecastCard({ day, date, icon, high, low, temperatureSymbol }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex flex-col items-center gap-1">
          <p className="font-medium">{day}</p>
          <p className="text-xs text-gray-500">{date}</p>
          {icon}
          <div className="mt-1 flex items-center gap-2">
            <span className="font-medium">{high}{temperatureSymbol}</span>
            <span className="text-sm text-gray-500">{low}{temperatureSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
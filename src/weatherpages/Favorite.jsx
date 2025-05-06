import React from 'react';
import { MapPin, Star, ArrowRight, Trash2, Cloud, Sun, CloudRain } from 'lucide-react';
import { useWeather } from "../WeatherContext/WeatherContext"

export default function FavoriteCard() {
  // Use the custom hook to access the context values
  const {
    favorites,
    setDefaultLocation,
    removeFromFavorites,
    handleCityChange
  } = useWeather();

  const getWeatherIcon = (iconType) => {
    switch(iconType) {
      case 'sun':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'cloud-rain':
        return <CloudRain className="h-6 w-6 text-sky-500" />;
      case 'cloud':
      default:
        return <Cloud className="h-6 w-6 text-sky-500" />;
    }
  };

  // Handle when no locations are saved
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-sky-50 p-4 mb-4">
          <MapPin className="h-8 w-8 text-sky-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No favorite locations</h3>
        <p className="text-gray-500 max-w-md">
          Search for a location and click the star icon to add it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((location, index) => (
        <div key={index} className="rounded-lg border border-gray-300 text-card-foreground overflow-hidden">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold tracking-tight flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {location.city}
              {location.isDefault && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  Default
                </span>
              )}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{location.country}</p>
                <p className="mt-1 text-sm">{location.condition}</p>
              </div>
              <div className="flex items-center gap-2">
                {getWeatherIcon(location.icon)}
                <span className="text-2xl font-bold">{location.temperature}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {!location.isDefault ? (
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex-1 gap-1"
                  onClick={() => setDefaultLocation(index)}
                >
                  <Star className="h-4 w-4" />
                  Set Default
                </button>
              ) : null}
              <button 
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 flex-1 gap-1"
                onClick={() => handleCityChange(location.city)}
              >
                View
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                onClick={() => removeFromFavorites(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
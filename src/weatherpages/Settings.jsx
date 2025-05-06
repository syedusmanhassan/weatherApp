import { useState, useEffect } from "react";
import { ChevronDown, Circle, Check, X } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext";

export function SettingsPage({ onUpdateSettings }) {
  const {
    temperatureUnit,
    aiTone,
    darkMode
  } = useWeather();

  // Local state for dropdown menus
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [aiToneDropdownOpen, setAiToneDropdownOpen] = useState(false);
  
  // Add toast notification state
  const [showToast, setShowToast] = useState(false);
  
  // Local state for handling changes before saving
  const [tempSettings, setTempSettings] = useState({
    temperatureUnit,
    darkMode,
    aiTone,
    defaultLocation: "New York, United States",
    notifications: false
  });
  
  // Location options
  const locations = [
    "New York, United States",
    "London, United Kingdom",
    "Tokyo, Japan",
    "Paris, France",
    "Sydney, Australia"
  ];
  
  const tones = ["Casual", "Professional", "Friendly", "Concise"];
  
  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleTemperatureUnitChange = (unit) => {
    setTempSettings(prev => ({ ...prev, temperatureUnit: unit }));
  };
  
  const toggleDarkMode = () => {
    setTempSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };
  
  const toggleNotifications = () => {
    setTempSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };
  
  const handleDefaultLocationChange = (location) => {
    setTempSettings(prev => ({ ...prev, defaultLocation: location }));
    setLocationDropdownOpen(false);
  };
  
  const handleAIToneChange = (tone) => {
    setTempSettings(prev => ({ ...prev, aiTone: tone }));
    setAiToneDropdownOpen(false);
  };
  
  const handleSave = () => {
    onUpdateSettings(tempSettings);
    // Show toast instead of alert
    setShowToast(true);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 shadow-md border border-green-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div className="ml-1">
            <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-green-600 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-lg border bg-white border-gray-300">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Display Preferences</h3>
              <p className="text-sm text-gray-500">Customize how weather information is displayed</p>
            </div>
            
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none mb-2 block">Temperature Unit</label>
                <div role="radiogroup" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={tempSettings.temperatureUnit === "celsius"}
                      value="celsius"
                      onClick={() => handleTemperatureUnitChange("celsius")}
                      className="aspect-square h-4 w-4 rounded-full border border-blue-600 text-blue-600"
                      id="celsius"
                    >
                      {tempSettings.temperatureUnit === "celsius" && (
                        <span className="flex items-center justify-center">
                          <Circle className="h-2.5 w-2.5 fill-current text-current" />
                        </span>
                      )}
                    </button>
                    <label className="text-sm font-medium leading-none" htmlFor="celsius">
                      Celsius (°C)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={tempSettings.temperatureUnit === "fahrenheit"}
                      value="fahrenheit"
                      onClick={() => handleTemperatureUnitChange("fahrenheit")}
                      className="aspect-square h-4 w-4 rounded-full border border-blue-600 text-blue-600"
                      id="fahrenheit"
                    >
                      {tempSettings.temperatureUnit === "fahrenheit" && (
                        <span className="flex items-center justify-center">
                          <Circle className="h-2.5 w-2.5 fill-current text-current" />
                        </span>
                      )}
                    </button>
                    <label className="text-sm font-medium leading-none" htmlFor="fahrenheit">
                      Fahrenheit (°F)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none" htmlFor="dark-mode">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500">
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tempSettings.darkMode}
                  value="on"
                  onClick={toggleDarkMode}
                  className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                    tempSettings.darkMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  id="dark-mode"
                >
                  <span
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      tempSettings.darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-300 bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Location Settings</h3>
              <p className="text-sm text-gray-500">Manage your preferred location settings</p>
            </div>
            
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium leading-none mb-2 block" htmlFor="default-location">
                  Default Location
                </label>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={locationDropdownOpen}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  id="default-location"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                >
                  <span style={{ pointerEvents: "none" }}>{tempSettings.defaultLocation}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                
                {locationDropdownOpen && (
                  <div className="absolute w-full z-10 mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white p-1">
                    {locations.map((location) => (
                      <div
                        key={location}
                        className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 ${
                          location === tempSettings.defaultLocation ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleDefaultLocationChange(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none" htmlFor="notifications">
                    Weather Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive alerts for severe weather conditions
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tempSettings.notifications}
                  value="on"
                  onClick={toggleNotifications}
                  className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                    tempSettings.notifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  id="notifications"
                >
                  <span
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      tempSettings.notifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-white border-gray-300">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">AI Assistant Preferences</h3>
              <p className="text-sm text-gray-500">Customize how the AI assistant communicates with you</p>
            </div>
            
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium leading-none mb-2 block" htmlFor="ai-tone">
                  AI Tone
                </label>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={aiToneDropdownOpen}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  id="ai-tone"
                  onClick={() => setAiToneDropdownOpen(!aiToneDropdownOpen)}
                >
                  <span style={{ pointerEvents: "none" }}>{tempSettings.aiTone}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                
                {aiToneDropdownOpen && (
                  <div className="absolute w-full z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-white p-1">
                    {tones.map((tone) => (
                      <div
                        key={tone}
                        className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 ${
                          tone === tempSettings.aiTone ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleAIToneChange(tone)}
                      >
                        {tone}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              onClick={handleSave}
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
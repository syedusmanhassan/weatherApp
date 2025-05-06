import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig/firebaseConfig';
import { signOut } from 'firebase/auth';
import Search from "./Search";
import WeatherCard from './WeatherCard';
import { Forecast } from "./WeatherTabs";
import FavoriteCard from './Favorite';
import { SettingsPage } from './Settings';
import ChatPage from './Chatpage';
import { CloudSun, LayoutDashboard, MessageSquare, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import { useWeather } from "../WeatherContext/WeatherContext";

export default function DashboardPage() {
  // Auth state
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  
  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    searchCity,
    currentPage,
    favorites,
    temperatureUnit,
    darkMode,
    aiTone,
    navigateTo,
    handleSearch,
    handleCityChange,
    addToFavorites,
    removeFromFavorites,
    setDefaultLocation,
    isLocationFavorite,
    updateSettings
  } = useWeather();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on navigation (for better UX in mobile)
  const handleNavigation = (page) => {
    navigateTo(page);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
 
  const renderMainContent = () => {
    switch(currentPage) {
      case 'favorites':
        return (
          <FavoriteCard 
            locations={favorites}
            setDefaultLocation={setDefaultLocation}
            removeLocation={removeFromFavorites}
            onViewLocation={handleCityChange}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            temperatureUnit={temperatureUnit}
            darkMode={darkMode}
            notifications={true} 
            aiTone={aiTone}
            onUpdateSettings={updateSettings}
          />
        );
      case 'chat':
        return (
          <ChatPage
            aiTone={aiTone}
          />
        );
      case 'dashboard':
      default:
        return (
          <div className="mx-auto max-w-5xl space-y-6">
            <WeatherCard 
              city={searchCity} 
              onCityChange={handleCityChange}
              temperatureUnit={temperatureUnit}
            />
            
            <Forecast 
              city={searchCity}
              temperatureUnit={temperatureUnit}
            />
          </div>
        );
    }
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center border-b border-gray-300 px-4">
        <a className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('dashboard')}>
          <CloudSun className="h-6 w-6 text-sky-500" />
          <span className="text-xl font-bold">SkySage</span>
        </a>
        {isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="ml-auto text-gray-600 dark:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-1 px-2">
          <div onClick={() => handleNavigation('dashboard')}>
            <button className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full justify-start gap-2 ${currentPage === 'dashboard' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:hover:text-sky-300' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'}`}>
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </button>
          </div>
          <div onClick={() => handleNavigation('chat')}>
            <button className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full justify-start gap-2 ${currentPage === 'chat' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:hover:text-sky-300' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'}`}>
              <MessageSquare className="h-5 w-5" />
              Chat
            </button>
          </div>
          <div onClick={() => handleNavigation('favorites')}>
            <button className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full justify-start gap-2 ${currentPage === 'favorites' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:hover:text-sky-300' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'}`}>
              <Heart className="h-5 w-5" />
              Favorites
            </button>
          </div>
          <div onClick={() => handleNavigation('settings')}>
            <button className={`inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full justify-start gap-2 ${currentPage === 'settings' ? 'bg-sky-100 text-sky-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:hover:text-sky-300' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'}`}>
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 p-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img className="aspect-square h-full w-full" alt="User" src="/api/placeholder/40/40" />
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.displayName || 'User'}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
          <div onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 h-10 w-10 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={`hidden border-r border-gray-300 ${darkMode ? 'bg-gray-900' : 'bg-white'} lg:block lg:w-64`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay - Only visible when open */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={toggleSidebar}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}
      
      {/* Mobile Sidebar - Slides in from left */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent isMobile={true} />
      </div>

      {/* Main Content */}
      <div className={`flex flex-1 flex-col overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <header className={`flex h-16 items-center justify-between border-b border-gray-300 px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Hamburger menu for mobile */}
          <button 
            onClick={toggleSidebar}
            className="mr-2 text-gray-600 dark:text-gray-300 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Search 
            onSearch={handleSearch} 
            addToFavorites={addToFavorites}
            isLocationFavorite={isLocationFavorite}
            currentCity={searchCity}
          />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
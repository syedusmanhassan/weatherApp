import React, { useState } from "react";
import { ArrowRight, CloudSun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900 dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 backdrop-blur">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-24 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="h-6 w-6 text-sky-500" />
            <span className="text-xl font-bold dark:text-white">SkySage</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 p-4">
            <Link to="/login">
              <button className="flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 h-10 px-4 py-2 dark:text-gray-200">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-[#2563EB] text-white hover:bg-sky-600 dark:hover:bg-sky-700 h-10 px-4 py-2">
                Sign Up
              </button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
            <div className="flex flex-col space-y-4 px-4 py-6">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-2 text-sm font-medium rounded-md bg-[#2563EB] text-white hover:bg-sky-600 dark:hover:bg-sky-700">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-white dark:from-sky-950 dark:to-gray-900 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-8 py-16 sm:py-20 md:py-32 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
                Know the weather.
                <br />
                <span className="text-sky-500">Feel the weather.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-xl">
                SkySage combines accurate weather forecasts with AI-powered insights to help you plan your day with
                confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/signup">
                <button className="flex items-center justify-center text-sm font-medium transition-colors bg-[#2563EB] text-white hover:bg-sky-600 dark:hover:bg-sky-700 h-11 rounded-md px-6 sm:px-8 gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900 dark:to-sky-950 p-1">
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">New York</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Partly Cloudy</p>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold dark:text-white">72°</div>
                  </div>
                  <div className="mt-4 rounded-lg bg-sky-50 dark:bg-sky-900/30 p-3">
                    <p className="text-xs sm:text-sm dark:text-gray-200">
                      <span className="font-medium">Gemini says:</span> Perfect day for a walk in Central Park! Don't
                      forget your sunglasses. ☀️👓
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl dark:text-white">AI-Powered Weather Insights</h2>
              <p className="text-gray-500 text-sm sm:text-base dark:text-gray-400">
                SkySage doesn't just tell you the weather—it helps you understand what it means for your day. Our AI
                assistant provides personalized recommendations based on current conditions.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm sm:text-base dark:text-gray-200">Personalized clothing recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm sm:text-base dark:text-gray-200">Activity suggestions based on weather</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm sm:text-base dark:text-gray-200">Natural language chat interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm sm:text-base dark:text-gray-200">Save and track multiple locations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-300 dark:border-gray-700 py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-24 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-sky-500" />
            <span className="font-semibold dark:text-white">SkySage</span>
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">© 2025 SkySage. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
              Privacy
            </a>
            <a className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
              Terms
            </a>
            <a className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
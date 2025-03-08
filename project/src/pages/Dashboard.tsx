import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Droplets, Wind, Search, MapPin, ThermometerSun, Clock, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';
import MapPicker from "./MapPicker";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";



function Dashboard() {
  const [location, setLocation] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, 'h:mm a')); // Example: 8:45 AM
      setCurrentDate(format(now, 'MMMM d, yyyy')); // Example: March 7, 2025
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            console.log("Reverse Geocode Data:", data); // Debugging
  
            // Extract location from the available fields
            const locationName =
              data.address.city ||
              data.address.county ||
              data.address.state_district ||
              data.address.state ||
              "Location Not Found";
  
            setLocation(locationName);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Error Retrieving Location");
          }
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLocation("Location Access Denied");
        }
      );
    } else {
      setLocation("Geolocation Not Supported");
    }
  }, []);
  
  const fetchLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      console.log("Reverse Geocode Data:", data); // Debugging

      // Extract location
      const locationName =
        data.address.city ||
        data.address.county ||
        data.address.state_district ||
        data.address.state ||
        "Location Not Found";

      setLocation(locationName);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation("Error Retrieving Location");
    }
  };

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          fetchLocation(latitude, longitude);
          fetchSunTimes(latitude, longitude); 
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLocation("Location Access Denied");
        }
      );
    } else {
      setLocation("Geolocation Not Supported");
    }
  }, []);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!searchQuery) return; // Don't search if input is empty

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0]; // Take the first result
        setLocation(display_name);
        fetchWeather(lat, lon);
      } else {
        setLocation("Location Not Found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setLocation("Error Searching Location");
    }
  };
  const fetchSunTimes = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const sunriseTime = new Date(data.results.sunrise);
        const sunsetTime = new Date(data.results.sunset);

        // Convert to local time
        setSunrise(format(sunriseTime, "h:mm a"));
        setSunset(format(sunsetTime, "h:mm a"));
      }
    } catch (error) {
      console.error("Error fetching sunrise/sunset:", error);
    }
  };
  const weatherData = {
    temperature: 20,
    probability: 9.8,
    condition: 'Storm with Heavy Rain',
    Time: {currentTime},
    Date: {currentDate},
    Sunrise: {sunrise},
    Sunset: {sunset},
    hourlyForecast: [
      { time: '6AM', temp: 20, city: 'Washington D.C.', icon: Sun },
      { time: '8AM', temp: 17, city: 'Oklahoma City', icon: CloudRain },
      { time: '10AM', temp: 14, city: 'Philadelphia', icon: Cloud },
      { time: '12PM', temp: 12, city: 'San Francisco', icon: Sun },
      { time: '2PM', temp: 10, city: 'New York City', icon: CloudRain },
      { time: '4PM', temp: -8, city: 'South Dakota', icon: Cloud },
      { time: '6PM', temp: -9, city: 'North Dakota', icon: CloudRain },
    ],
    details: {
      humidity: 65,
      windSpeed: 12,
      visibility: '0.5km - 1km',
      precipitation: '12% - 38%',
    }
  };

  return (
    <div className="min-h-screen weather-bg">
      <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-sm p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search location..."
                className="w-full px-6 py-4 bg-white/10 rounded-2xl text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/25 transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" size={24} />
            </div>
          </div>

          {/* Main Weather Card */}
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Panel - Current Weather */}
              <div className="col-span-4 border-r border-white/10">
                <div className="animate-float">
                  <CloudRain className="text-blue-400 w-24 h-24 mb-6" />
                </div>
                <div className="mb-8">
                  <div className="flex items-start">
                    <span className="text-8xl font-light text-white">{weatherData.temperature}°</span>
                    <span className="text-2xl text-white/60 mt-4">C</span>
                  </div>
                  <h2 className="text-3xl font-light text-white/80 mt-4">{weatherData.condition}</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white/60">
                  <div className="flex items-center gap-4 text-white/60 cursor-pointer">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={20} className="hover:text-white transition duration-300" />
                    </a>
                    <span>{location}</span>
                  </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <Clock size={20} />
                    <span>{weatherData.Time.currentTime}, {weatherData.Date.currentDate}</span>
                  </div>
                </div>
              </div>

              {/* Right Panel - Details */}
              <div className="col-span-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Sun Times */}
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-white/80 font-medium">Sunrise & Sunset</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Sunrise className="text-orange-400" size={24} />
                        <div>
                          <p className="text-white text-lg">{weatherData.Sunrise.sunrise}</p>
                          <p className="text-white/60 text-sm">Sunrise</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sunset className="text-purple-400" size={24} />
                        <div>
                          <p className="text-white text-lg">{weatherData.Sunset.sunset}</p>
                          <p className="text-white/60 text-sm">Sunset</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-white/80 font-medium">Air Conditions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <ThermometerSun className="text-red-400" size={24} />
                        <div>
                          <p className="text-white text-lg">{weatherData.details.humidity}%</p>
                          <p className="text-white/60 text-sm">Humidity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Wind className="text-blue-400" size={24} />
                        <div>
                          <p className="text-white text-lg">{weatherData.details.windSpeed} km/h</p>
                          <p className="text-white/60 text-sm">Wind Speed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hourly Forecast */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-white/80 font-medium mb-6">Today's Forecast</h3>
                  <div className="relative">
                    <div className="temp-line"></div>
                    <div className="grid grid-cols-7 gap-4">
                      {weatherData.hourlyForecast.map((hour, index) => {
                        const Icon = hour.icon;
                        return (
                          <div key={hour.time} className="relative text-center group transition-transform hover:scale-105">
                            <div className="text-2xl font-light text-white mb-4">{hour.temp}°</div>
                            <Icon className={`mx-auto mb-4 ${index === 0 ? 'text-yellow-400' : 'text-white/60'}`} size={24} />
                            <div className="text-sm text-white/60">{hour.time}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded font-semibold"
      >
        Logout
      </button>
    </div>
    </div>
    
  );
}

export default Dashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [inputCity, setInputCity] = useState(""); // Stores user input
  const [city, setCity] = useState(""); // Stores the actual searched city
  const [weatherData, setWeatherData] = useState(null); // Stores weather data
  const [error, setError] = useState(null); // Stores error messages
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks search submission
 
  // Update inputCity as user types (does not trigger search)
  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setInputCity(newCity);

    // If the input is cleared, reset everything back to default
    if (newCity.trim() === "") {
      setWeatherData(null);
      setError(null);
      setIsSubmitted(false);
    }
  };

  // Handle search button click or Enter key press
  const handleSearch = () => {
    if (inputCity.trim() === "") {
      // Reset everything if search bar is empty
      setCity("");
      setWeatherData(null);
      setError(null);
      setIsSubmitted(false);
    } else {
      setCity(inputCity); // Update city for search
      setIsSubmitted(true); // Trigger search
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Fetch weather when `isSubmitted` changes
  useEffect(() => {
    let isMounted = true; // flag to track if the component is still mounted
    if (isSubmitted && city.trim() !== "") {
      const fetchWeatherData = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e312dbeb8840e51f92334498a261ca1d`
          );
          if (isMounted) {
            setWeatherData(response.data);
            setError(null); // Clear errors on success
          }
        } catch (error) {
          if (isMounted) {
            setError("Sorry! That city or town does not exist.");
            setWeatherData(null);
          }
        } finally {
          if (isMounted) setIsSubmitted(false); // Reset submission flag
        }
      };
  
      fetchWeatherData();
    }
  
    return () => {
      isMounted = false;
    };
  }, [isSubmitted, city]);  // Only fetch when city updates

  // Converting Celsius to Fahrenheit
  const Fahrenheit = (celsius) => (celsius * 9) / 5 + 32;

  return (
    <div>
      <h1>Weather Information</h1>

      <input
        type="text"
        value={inputCity}
        onChange={handleCityChange} // Update input field only
        onKeyPress={handleKeyPress} // Trigger search on Enter key press
        placeholder="Enter city name"
        aria-label="Search for city weather"
      />
      <button onClick={handleSearch} aria-label="Search weather">
        Search
      </button>

      {/* Show error only if search was submitted and city is invalid */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {isSubmitted && !error && !weatherData && <p>Fetching weather data, please wait...</p>}

      {weatherData ? (
        <div>
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p>
            Temperature: {Math.round(weatherData.main.temp)}°C |{" "}
            {Math.round(Fahrenheit(weatherData.main.temp))}°F
          </p>
          <p>
            Weather:{" "}
            <img
              src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt="weather-icon"
            />{" "}
            {weatherData.weather[0].description}
          </p>
        </div>
      ) : (
        isSubmitted && !error && city.trim() !== "" && <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherApp;
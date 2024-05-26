import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const CONDITIONS = {
  TEMPERATURE: "Temperature",
  CONDITION: "Condition",
  WIND_SPEED: "Wind Speed",
  HUMIDITY: "Humidity",
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({});
  const [inputLocationText, setInputLocationText] = useState("");
  const [loading, setLoading] = useState(false);

  const WEATHER_API_KEY = "110d168150c1414a971111728243103";

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      let res = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`
      );
      setWeatherData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 400) {
        alert("Failed to fetch weather data");
      }
      setWeatherData({});
    }
  };

  const handleSearch = () => {
    if (inputLocationText) {
      fetchWeatherData(inputLocationText);
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const renderTextInput = () => {
    return (
      <input
        type="text"
        className="search-input"
        placeholder="Enter Location"
        value={inputLocationText}
        onChange={(event) => setInputLocationText(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
    );
  };

  const renderCard = (label, value) => (
    <div className="weather-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );

  const renderLocationData = () => {
    return weatherData.location ? (
      <>
        <h2>
          {weatherData.location.name + ", " + weatherData.location.country}
        </h2>
        <div className="weather-info">
          {renderCard(CONDITIONS.TEMPERATURE, weatherData.current.temp_c + "°C")}
          {renderCard(CONDITIONS.CONDITION, weatherData.current.condition.text)}
          {renderCard(CONDITIONS.WIND_SPEED, weatherData.current.wind_kph + " km/h")}
          {renderCard(CONDITIONS.HUMIDITY, weatherData.current.humidity + " %")}
          {loading && <p>Loading data...</p>}
        </div>
      </>
    ) : null;
  };

  return (
    <div className="container">
      <div className="content">
        {renderTextInput()}
        <button
          onClick={handleSearch}
          className="search-button"
        >
          Search
        </button>
        {renderLocationData()}
      </div>
    </div>
  );
}

export default Weather;

import { useState } from "react";
import { useEffect } from "react";

import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function App() {
  // State to store fetched data
  const [data, setData] = useState(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);

  // Function to fetch data from API for a given location
  const fetchData = async (location) => {
    console.log("fetching data");
    let response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=eac5a1b67ad94597a0390149243004&q=${location}&aqi=no`
    );

    if (response.status !== 200) {
      console.log("Error fetching data");
      alert("Enter Correct Location");
      return;
    }

    const fdata = await response.json();
    setData(fdata);
    setLocationSearch("");
  };

  // Function to fetch data from API for user's location
  const fetchDataByCoords = async () => {
    console.log("fetching data");
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=eac5a1b67ad94597a0390149243004&q=${userLatitude},${userLongitude}&aqi=no`
    );

    if (response.status !== 200) {
      console.log("Error fetching data");
      alert("Enter Correct Location");
      return;
    }
    console.log("fetching data");

    const fdata = await response.json();
    setData(fdata);
  };

  // Function to get user's location
  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      setUserLatitude(lat);
      setUserLongitude(long);
      console.log("Location fetched", lat, long);
      console.log("userLocation", userLatitude, userLongitude);
      fetchDataByCoords(); // Call fetchDataByCoords here
    });
  };

  // Fetch location on component load
  useEffect(() => {
    getLocation(); // Call getLocation here
  }, [userLatitude, userLongitude]); // Add userLatitude and userLongitude as dependencies

  // Function to handle search
  // execute when search button is clicked
  const handleSearch = () => {
    if (!locationSearch) return;
    fetchData(locationSearch);
  };

  // Function to get weather condition class
  const getWeatherConditionClass = () => {
    if (!data || !data.current || !data.current.condition) return ""; // Handle empty data

    const condition = data.current.condition.text.toLowerCase();

    // checks almost all possible weather conditions from the API and return the class name accordingly
    switch (condition) {
      case "sunny":
        return "sunny";
      case "partly cloudy":
      case "cloudy":
        return "cloudy";
      case "overcast":
      case "mist":
      case "̥̥̥̥̥patchy rain possible":
      case "patchy snow possible":
      case "patchy sleet possible":
      case "moderate rain at times":
        return "overcast";
      case "light rain":
      case "moderate rain":
      case "patchy freezing drizzle possible":
      case "fog":
      case "freezing fog":
      case "patchy light drizzle":
      case "light drizzle":
      case "patchy light rain":
      case "heavy rain at times":
      case "patchy light snow":
      case "light snow":
      case "light sleet":
      case "light rain shower":
      case "light sleet showers":
      case "light snow showers":
      case "patchy light rain with thunder":
      case "patchy light snow with thunder":
      case "light showers of ice pellets":
      case "patchy rain nearby":
        return "rainy";
      case "moderate or heavy sleet showers":
      case "moderate or heavy rain shower":
      case "moderate or heavy snow showers":
      case "moderate or heavy showers of ice pellets":
      case "moderate or heavy rain with thunder":
      case "moderate or heavy snow with thunder":
      case "torrential rain shower":
      case "patchy moderate snow":
      case "moderate snow":
      case "patchy heavy snow":
      case "heavy snow":
      case "ice pellets":
      case "moderate or heavy sleet":
      case "freezing drizzle":
      case "blowing snow":
      case "blizzard":
      case "heavy rain":
      case "light freezing rain":
      case "moderate or heavy freezing rain":
      case "thundery outbreaks possible":
      case "Heavy freezing drizzle":
        return "heavy-rainy";
      default:
        return ""; // Handle unexpected conditions
    }
  };

  // Render
  return (
    <div className={`container ${getWeatherConditionClass()}`}>
      <div className={`weather-container`}>
        {/* Heading */}
        <h1>Weather App</h1>

        {/* Search Field */}
        <div className="input-container">
          <TextField
            id="standard-basic"
            value={locationSearch}
            fullWidth
            label="Search"
            placeholder="Enter Location Place"
            variant="standard"
            className="searchField"
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="text" className="Button" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </Button>
        </div>

        {/* Weather Display */}
        <div className="display-container">
          {/* When state data is null*/}
          {!data && (
            <>
              <h1>Enter Location for Weather</h1>
            </>
          )}
          {/* when state data have data to show*/}
          {data && (
            <>
              <div className="content">
                <h1>{data.location.name}</h1>
                <h6>
                  {data.location.country} - {data.location.localtime}
                </h6>
              </div>
              <div className="content">
                <h2>
                  Temp:<br/>
                  {data.current.temp_c}°C
                </h2>
                <img src={data.current.condition.icon} />
                <h6>{data.current.condition.text}</h6>
              </div>
              <div className="extraInfo">
                <div className="content">
                  <p>Wind:</p>
                  <p>{data.current.wind_kph} km/h</p>
                </div>
                <div className="content">
                  <p>Wind Dir:</p>
                  <p>{data.current.wind_dir}</p>
                </div>
                <div className="content">
                  <p>Humidity:</p>
                  <p>{data.current.humidity}%</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import axios from 'axios';
import dayjs from 'dayjs';
import tippyjs from 'tippy.js';
import {
  clearData,
  getData,
  setData,
} from './data';
import {
  apiUrl,
} from './helpers';

export async function getWeatherData (lat, lng) {
  const weatherApiurl = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
  const weatherData =  await axios.get(weatherApiurl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return weatherData;
};

export function getWeatherIcon(icon) {
  const iconMap = {
    'clear-day': 'fad fa-fw fa-sun',
    'clear-night': 'fad fa-fw fa-moon-stars',
    rain: 'fad fa-fw fa-cloud-rain',
    snow: 'fad fa-fw fa-cloud-snow',
    sleet: 'fad fa-fw fa-cloud-sleet',
    wind: 'fad fa-fw fa-wind',
    fog: 'fad fa-fw fa-fog',
    cloudy: 'fad fa-fw fa-clouds',
    'partly-cloudy-day': 'fad fa-fw fa-clouds-sun',
    'partly-cloudy-night': 'fad fa-fw fa-clouds-moon',
    hail: 'fad fa-fw fa-cloud-hail',
    hurricane: 'fad fa-fw fa-hurricane',
    thunderstorm: 'fad fa-fw fa-thunderstorm',
    tornado: 'fad fa-fw fa-tornado',
  };
  return iconMap[icon];
}

async function geolocationError(error) {
  console.error(error);
}

export function populateWeatherAndLocation(weatherAndLocationData) {
  const { locationName } = weatherAndLocationData[0].location;
  const locationEl = document.querySelector('.weather-location');
  locationEl.textContent = locationName;
  const {
    apparentTemperature,
    icon,
    summary,
    temperature,
  } = weatherAndLocationData[1].weather.currently;
  document.querySelector('.weather-temp').innerHTML = `${Math.round(temperature)}&deg;`;
  document.querySelector('.icon-and-temp').setAttribute('title', `${locationName}\n${summary}\nFeels Like ${Math.round(apparentTemperature)} degrees`);
  const weatherIconClass = getWeatherIcon(icon);
  const weatherIcon = document.querySelector('.weather-icon');
  weatherIcon.removeAttribute('class');
  weatherIcon.setAttribute('class', `${weatherIconClass} weather-icon`);
}

export async function resetAndGetWeatherData(lat, lng) {
  clearData('weatherData');
  clearData('weatherLastUpdated');
  const weatherAndLocation = await getWeatherData(lat, lng);
  setData('weatherData', weatherAndLocation);
  setData('weatherLastUpdated', dayjs());

  return weatherAndLocation;
}

export async function getLocationNameAndWeather(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  const lastUpdated = getData('weatherLastUpdated');
  let weatherAndLocation = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(20, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      weatherAndLocation = await resetAndGetWeatherData(lat, lng);
    } else {
      weatherAndLocation = getData('weatherData');
    }
  } else {
    weatherAndLocation = await resetAndGetWeatherData(lat, lng);
  }
  populateWeatherAndLocation(weatherAndLocation);
}

export async function doGeolocation() {
  const geolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 3600000 // 1 hour (number of seconds * 1000 milliseconds)
  };
  navigator.geolocation.getCurrentPosition(getLocationNameAndWeather, geolocationError, geolocationOptions);
}

export async function initWeather() {
  const lastUpdated = getData('weatherLastUpdated');
  const weatherAndLocation = getData('weatherData');

  if (lastUpdated && weatherAndLocation) {
    const nextUpdateTime = dayjs(lastUpdated).add(20, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      doGeolocation();
    } else {
      populateWeatherAndLocation(weatherAndLocation);
    }
  } else {
    doGeolocation();
  }
}

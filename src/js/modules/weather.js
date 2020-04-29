import axios from 'axios';
import dayjs from 'dayjs';
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
  // let errorMessage = '';
  // switch (error.code) {
  //   case error.PERMISSION_DENIED:
  //     errorMessage = errorTemplates.geolocationPermission;
  //     break;
  //   case error.POSITION_UNAVAILABLE:
  //     errorMessage = errorTemplates.geolocationPosition;
  //     break;
  //   case error.TIMEOUT:
  //     errorMessage = errorTemplates.geolocationTimeout;
  //     break;
  //   case error.UNKNOWN_ERROR:
  //     errorMessage = errorTemplates.geolocationUnknown;
  //     break;
  //   default:
  //     break;
  // }
  console.error(error);
}

export async function getLocationNameAndWeather(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  const lastUpdated = getData('weatherLastUpdated');
  let weatherAndLocation = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(20, 'minute');
    if (dayjs(lastUpdated).isAfter(nextUpdateTime) || lastUpdated === null) {
      weatherAndLocation = await getWeatherData(lat, lng);
      clearData('weatherData');
      clearData('weatherLastUpdated');
      setData('weatherData', weatherAndLocation);
      setData('weatherLastUpdated', dayjs());
    } else {
      weatherAndLocation = getData('weatherData');
    }
  } else {
    weatherAndLocation = await getWeatherData(lat, lng);
    clearData('weatherData');
    clearData('weatherLastUpdated');
    setData('weatherData', weatherAndLocation);
    setData('weatherLastUpdated', dayjs());
  }
  const { locationName } = weatherAndLocation[0].location;
  const locationEl = document.querySelector('.weather-location');
  locationEl.textContent = locationName;
  const { currently } = weatherAndLocation[1].weather;
  document.querySelector('.weather-temp').innerHTML = `${Math.round(currently.temperature)}&deg;`;
  const weatherIconClass = getWeatherIcon(currently.icon);
  const weatherIcon = document.querySelector('.weather-icon');
  weatherIcon.removeAttribute('class');
  weatherIcon.setAttribute('class', `${weatherIconClass} weather-icon`);
}

export async function initWeather() {
  await navigator.geolocation.getCurrentPosition(getLocationNameAndWeather, console.error);
}

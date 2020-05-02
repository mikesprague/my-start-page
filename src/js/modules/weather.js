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
    rain_heavy: 'fad fa-fw fa-cloud-showers',
    rain: 'fad fa-fw fa-cloud-rain',
    rain_light: 'fad fa-fw fa-cloud-drizzle',
    freezing_rain_heavy: 'fad fa-fw fa-cloud-sleet',
    freezing_rain: 'fad fa-fw fa-cloud-sleet',
    freezing_rain_light: 'fad fa-fw fa-cloud-sleet',
    freezing_drizzle: 'fad fa-fw fa-cloud-sleet',
    drizzle: 'fad fa-fw fa-cloud-drizzle',
    ice_pellets_heavy: 'fad fa-fw fa-cloud-hail',
    ice_pellets: 'fad fa-fw fa-cloud-hail',
    ice_pellets_light: 'fad fa-fw fa-cloud-hail',
    snow_heavy: 'fad fa-fw fa-cloud-snow',
    snow: 'fad fa-fw fa-cloud-snow',
    snow_light: 'fad fa-fw fa-cloud-snow',
    flurries: 'fad fa-fw fa-cloud-snow',
    tstorm: 'fad fa-fw fa-thunderstorm',
    fog_light: 'fad fa-fw fa-fog',
    fog: 'fad fa-fw fa-fog',
    cloudy: 'fad fa-fw fa-cloud',
    mostly_cloudy: 'fad fa-fw fa-clouds',
    partly_cloudy: {
      day: 'fad fa-fw fa-cloud-sun',
      night: 'fad fa-fw fa-cloud-moon',
    },
    mostly_clear: {
      day: 'fad fa-fw fa-sun-cloud',
      night: 'fad fa-fw fa-moon-cloud',
    },
    clear: {
      day: 'fad fa-fw fa-sun',
      night: 'fad fa-fw fa-moon-stars',
    },
  };
  const iconsWithDayNight = ['partly_cloudy', 'mostly_clear', 'clear'];
  if (iconsWithDayNight.includes(icon)) {
    const hour = dayjs().hour();
    const timeOfDay = hour >= 5 && hour <= 19 ? 'day' : 'night';
    return iconMap[icon][timeOfDay];
  }
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

export function populateWeatherAndLocation(weatherAndLocationData) {
  const { locationName } = weatherAndLocationData[0].location;
  const locationEl = document.querySelector('.weather-location');
  locationEl.textContent = locationName;
  const {
    temp,
    weather_code: icon,
  } = weatherAndLocationData[1].weather;
  document.querySelector('.weather-temp').innerHTML = `${Math.round(temp.value)}&deg;`;
  const weatherIconClass = getWeatherIcon(icon.value);
  const weatherIcon = document.querySelector('.weather-icon');
  weatherIcon.removeAttribute('class');
  weatherIcon.setAttribute('class', `${weatherIconClass} weather-icon`);
}

export async function getLocationNameAndWeather(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  const lastUpdated = getData('weatherLastUpdated');
  let weatherAndLocation = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(20, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      clearData('weatherData');
      clearData('weatherLastUpdated');
      weatherAndLocation = await getWeatherData(lat, lng);
      setData('weatherData', weatherAndLocation);
      setData('weatherLastUpdated', dayjs());
    } else {
      weatherAndLocation = getData('weatherData');
    }
  } else {
    clearData('weatherData');
    clearData('weatherLastUpdated');
    weatherAndLocation = await getWeatherData(lat, lng);
    setData('weatherData', weatherAndLocation);
    setData('weatherLastUpdated', dayjs());
  }
  populateWeatherAndLocation(weatherAndLocation);
}

export async function initWeather() {
  const lastUpdated = getData('weatherLastUpdated');
  const weatherAndLocation = getData('weatherData');
  const geolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 3600000 // 1 hour (number of seconds * 1000 milliseconds)
  };
  if (lastUpdated && weatherAndLocation) {
    const nextUpdateTime = dayjs(lastUpdated).add(20, 'minute');
    if (dayjs().isAfter(nextUpdateTime)) {
      navigator.geolocation.getCurrentPosition(getLocationNameAndWeather, geolocationError, geolocationOptions);
    } else {
      populateWeatherAndLocation(weatherAndLocation);
    }
  } else {
    navigator.geolocation.getCurrentPosition(getLocationNameAndWeather, geolocationError, geolocationOptions);
  }
}

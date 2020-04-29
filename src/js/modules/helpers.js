import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCloudsSun,
  faSun,
  faMoonStars,
  faCloudRain,
  faCloudSnow,
  faCloudSleet,
  faWind,
  faFog,
  faClouds,
  faCloudsMoon,
  faCloudHail,
  faHurricane,
  faThunderstorm,
  faTornado,
  faImage,
  faUser,
  faHourglassHalf,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import {
  resetData,
} from './data';

export function apiUrl () {
  if (window.location.origin.includes('-extension://')) {
    return 'https://my-start-page.netlify.app/.netlify/functions';
  }
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:9000';
  }
  return `https://${window.location.hostname}/.netlify/functions`;
}

export function initIcons() {
  library.add(
    faCloudsSun,
    faImage,
    faUser,
    faGithub,
    faHackerNews,
    faProductHunt,
    faRedditAlien,
    faSun,
    faMoonStars,
    faCloudRain,
    faCloudSnow,
    faCloudSleet,
    faWind,
    faFog,
    faClouds,
    faCloudsMoon,
    faCloudHail,
    faHurricane,
    faThunderstorm,
    faTornado,
    faHourglassHalf,
  );
  dom.watch();
}

export function handleError(error) {
  console.error(error);
}

export function initServiceWorker () {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated to the latest version.\n${registration}`);
      resetData();
      window.location.reload(true);
    },
    offline() {
      console.info('No internet connection found. App is currently offline.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
};

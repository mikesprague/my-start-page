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

export function apiUrl () {
  if (window.location.origin.includes('chrome-extension://')) {
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

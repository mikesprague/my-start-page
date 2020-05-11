import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faGithub,
  faHackerNews,
  faProductHunt,
  faRedditAlien,
  faChrome,
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
  faThunderstorm,
  faImage,
  faUser,
  faHourglassHalf,
  faCode,
  faCloudShowers,
  faCloudDrizzle,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faSunCloud,
  faMoonCloud,
  faTint,
  faThermometerHalf,
  faMapMarkerAlt,
  faExternalLink,
  faStar,
  faShareAlt,
  faCalendar,
  faSyncAlt,
} from '@fortawesome/pro-duotone-svg-icons';
import { register } from 'register-service-worker';
import tippy from 'tippy.js';
import {
  resetData,
} from './data';

export function isExtension () {
  if (window.location.origin.includes('-extension://')) {
    return true;
  }
  return false;
}

export function isDev () {
  if (window.location.hostname === 'localhost') {
    return true;
  }
  return false;
}

export function apiUrl () {
  if (isExtension()) {
    return 'https://my-start.page/.netlify/functions';
  }
  if (isDev()) {
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
    faCloudDrizzle,
    faCloudRain,
    faCloudShowers,
    faCloudSnow,
    faCloudSleet,
    faSunCloud,
    faMoonCloud,
    faWind,
    faFog,
    faCloud,
    faClouds,
    faCloudsMoon,
    faCloudMoon,
    faCloudSun,
    faCloudHail,
    faThunderstorm,
    faHourglassHalf,
    faCode,
    faTint,
    faThermometerHalf,
    faMapMarkerAlt,
    faExternalLink,
    faStar,
    faShareAlt,
    faCalendar,
    faSyncAlt,
    faChrome,
  );
  dom.watch();
}

export function initTooltips() {
  tippy('[data-tippy-content]', {
    allowHTML: true,
    placement: 'left',
    interactive: true,
  });
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

export function initPwaLinks() {
  if (!isExtension()){
    const appTitleEl = document.querySelector('.pwa-link-tooltip');
    const appTitleTooltip = `
      <a href="https://chrome.google.com/webstore/detail/my-start-page/pjmobojmaaemcnoiccepkecplpddaaaa" target="_blank" rel="noopener">
        View/Install in <i class='fab fa-fw fa-chrome'></i> Chrome Store
      </a>
    `;
    appTitleEl.setAttribute('data-tippy-content', appTitleTooltip);
    appTitleEl.innerHTML = `
      <a href="https://chrome.google.com/webstore/detail/my-start-page/pjmobojmaaemcnoiccepkecplpddaaaa" target="_blank" rel="noopener">
        My Start Page
      </a>
    `;
  }
  const authorNameEl = document.querySelector('.author-container');
  const authorNameTooltip = `
    <a href="https://www.github.com/mikesprague/my-start-page" target="_blank" rel="noopener">
      Source code available on <i class='fab fa-fw fa-github'></i> GitHub
    </a>
  `;
  authorNameEl.setAttribute('data-tippy-content', authorNameTooltip);
}

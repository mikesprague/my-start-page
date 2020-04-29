import '../scss/styles.scss';
import { register } from 'register-service-worker';
import {
  initClock,
  setGreeting,
} from './modules/clock';
import {
  clearData,
  exampleUnsplashApiData,
  getData,
  setData,
} from './modules/data';
import {
  initIcons,
} from './modules/helpers';
import {
  initWeather,
} from './modules/weather';

async function getUnsplashImageData() {
  const apiData = exampleUnsplashApiData();
  const {
    links,
    location,
    urls,
    user,
  } = apiData;
  const {
    html: imageLink,
  } = links;
  const {
    title,
    name,
  } = location;
  const {
    regular: imageUrl
  } = urls;
  const {
    name: userName,
    links: userLinks,
  } = user;
  const {
    html: userLink,
  } = userLinks;
  return {
    title,
    name,
    imageLink,
    imageUrl,
    userLink,
    userName,
  };
}

const setImageAndMetaData = async () => {
  const {
    title,
    name,
    imageLink,
    imageUrl,
    userLink,
    userName,
  } = await getUnsplashImageData();
  document.body.style.background = `url('${imageUrl}') no-repeat center center fixed`;
  document.body.style.backgroundSize = 'cover';
  const linkSuffix = '?utm_source=My%20Browser%20Start%20Page&utm_medium=referral';
  const bgMetadataEl = document.querySelector('.bg-metadata');
  bgMetadataEl.innerHTML = `
    <span class="text-muted">
      <a class="" href="${imageLink}${linkSuffix}" target="_blank"><i class="fad fa-fw fa-image"></i> ${title || name}</a>
      <br>
      <a href="${userLink}${linkSuffix}" target="_blank"><i class="fad fa-fw fa-user"></i> ${userName}</a>
      via
      <a href="https://unsplash.com/${linkSuffix}" target="_blank">Unsplash</a>
    </span>
  `;
};

const initServiceWorker = () => {
  register('/service-worker.js', {
    updated(registration) {
      console.log(`Updated to the latest version.\n${registration}`);
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

const initApp = () => {
  initServiceWorker();
  setImageAndMetaData();
  initClock();
  setGreeting();
  initIcons();
  initWeather();
};

document.onreadystatechange = async () => {
  if (document.readyState === 'interactive') {
    // code goes here
    initApp();
  }
};

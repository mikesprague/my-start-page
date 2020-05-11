import '../scss/styles.scss';
import {
  initBgImages,
  preloadBgImages,
} from './modules/background-images';
import {
  initClock,
} from './modules/clock';
import {
  initGitHubPopup,
} from './modules/github';
import {
  initHackerNewsPopup,
} from './modules/hacker-news';
import {
  initIcons,
  initServiceWorker,
  initTooltips,
} from './modules/helpers';
import {
  initProductHuntPopup,
} from './modules/product-hunt';
import {
  initDesignQuote,
} from './modules/quotes';
import {
  initRedditPopup,
} from './modules/reddit';
import {
  initWeather,
} from './modules/weather';


const initApp = async () => {
  initServiceWorker();
  await initBgImages();
  initClock(5);
  initDesignQuote();
  initWeather();
  initRedditPopup();
  initHackerNewsPopup();
  initProductHuntPopup();
  initGitHubPopup();
  initIcons();
  initTooltips();
  preloadBgImages();
};

document.onreadystatechange = async () => {
  if (document.readyState === 'interactive') {
    // code goes here
    initApp();
  }
};

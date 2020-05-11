import '../scss/styles.scss';
import {
  initBgImages,
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
  initPwaLinks,
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


const initApp = () => {
  initServiceWorker();
  initBgImages();
  initClock(5);
  initDesignQuote();
  initWeather();
  initRedditPopup();
  initHackerNewsPopup();
  initProductHuntPopup();
  initGitHubPopup();
  initIcons();
  initPwaLinks();
  initTooltips();
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    // code goes here
    initApp();
  }
};

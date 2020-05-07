import '../scss/styles.scss';
import {
  setImageAndMetaData,
} from './modules/background-images';
import {
  initClock,
} from './modules/clock';
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


const initApp = () => {
  initServiceWorker();
  setImageAndMetaData();
  initClock(5);
  initIcons();
  initDesignQuote();
  initWeather();
  initTooltips();
  initRedditPopup();
  initHackerNewsPopup();
  initProductHuntPopup();
};

document.onreadystatechange = async () => {
  if (document.readyState === 'interactive') {
    // code goes here
    initApp();
  }
};

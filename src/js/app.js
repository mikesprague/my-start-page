import '../scss/styles.scss';
import {
  setImageAndMetaData,
} from './modules/background-images';
import {
  initClock,
} from './modules/clock';
import {
  initIcons,
  initServiceWorker,
} from './modules/helpers';
import {
  initDesignQuote,
} from './modules/quotes';
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
};

document.onreadystatechange = async () => {
  if (document.readyState === 'interactive') {
    // code goes here
    initApp();
  }
};

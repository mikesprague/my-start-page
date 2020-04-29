import '../scss/styles.scss';
import {
  setImageAndMetaData,
} from './modules/background-images';
import {
  initClock,
  setGreeting,
} from './modules/clock';
import {
  initIcons,
  initServiceWorker,
} from './modules/helpers';
import {
  initWeather,
} from './modules/weather';

const initApp = () => {
  initServiceWorker();
  setImageAndMetaData();
  initClock(5);
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

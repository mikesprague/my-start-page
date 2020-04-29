import dayjs from 'dayjs';

export function updateDateTime () {
  const timeContainer = document.querySelector('.time-container');
  const dateContainer = document.querySelector('.date-container');
  const currentDateTime = dayjs();
  const timeFormatted = dayjs(currentDateTime).format('H:mm');
  const dateFormatted = dayjs(currentDateTime).format('dddd, MMMM D');
  timeContainer.textContent = timeFormatted;
  dateContainer.textContent = dateFormatted;
}

export function setGreeting () {
  const greetingContainer = document.querySelector('.greeting-container');
  const currentHour = dayjs().hour();
  let timeOfDayString = 'morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeOfDayString = 'afternoon';
  }
  if (currentHour >= 17 || currentHour <= 3 ) {
    timeOfDayString = 'evening';
  }
  const currentGreeting = `Good ${timeOfDayString}`;
  greetingContainer.textContent = currentGreeting;
  return currentGreeting;
}

export function initClock (updateIntervalInSeconds = 1) {
  updateDateTime();
  setInterval(updateDateTime, (updateIntervalInSeconds  * 1000));
}

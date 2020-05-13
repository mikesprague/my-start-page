import axios from 'axios';
import dayjs from 'dayjs';
import {
  clearData,
  getData,
  isCached,
  isCacheValid,
  setData,
} from './data';
import {
  apiUrl,
} from './helpers';

export async function getDesignQuoteData() {
  const designQuoteApiUrl = `${apiUrl()}/quotes`;
  const designQuoteData = await axios.get(designQuoteApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return designQuoteData;
}

async function getAndSetQuoteData () {
  const apiData = await getDesignQuoteData();
  clearData('quoteData');
  clearData('quoteLastUpdated');
  setData('quoteData', apiData);
  setData('quoteLastUpdated', dayjs());

  return apiData;
}

export async function getDesignQuote() {
  const cacheExists = isCached('quoteData');
  let apiData = null;
  if (cacheExists) {
    const cacheValid = isCacheValid('quoteLastUpdated', 6, 'hour');
    if (cacheValid) {
      apiData = getData('quoteData');
    } else {
      apiData = await getAndSetQuoteData();
    }
  } else {
    apiData = await getAndSetQuoteData();
  }

  return apiData;
}

export async function initDesignQuote() {
  const designQuoteData = await getDesignQuote();
  const randomQuoteNumber = Math.floor(Math.random() * (designQuoteData.length - 1));
  const designQuote = designQuoteData[randomQuoteNumber];
  const designQuoteHtml = `
    <a href="${designQuote.quoteLink}" target="_blank" rel="noopener">${designQuote.quoteExcerpt}</a>
    <p class="quote-author">&mdash; ${designQuote.quoteAuthor}</p>
  `;
  const quoteElement = document.querySelector('.quote-container');
  quoteElement.innerHTML = designQuoteHtml;
}

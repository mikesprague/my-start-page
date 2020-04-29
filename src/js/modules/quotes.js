import axios from 'axios';
import dayjs from 'dayjs';
import {
  clearData,
  getData,
  setData,
} from './data';

export async function getDesignQuoteData() {
  const designQuoteApiUrl = 'https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand';
  const designQuoteData = await axios.get(designQuoteApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return designQuoteData;
}

const normalizeQuoteData = (apiData) => {
  const returnData = apiData.map((quoteData) => {
    const {
      content,
      date: dateAuthored,
      link: quoteLink,
      title,
    } = quoteData || null;
    const {
      rendered: quoteHtml,
    } = content;
    const {
      rendered: quoteAuthor,
    } = title;

    return {
      quoteHtml,
      quoteAuthor,
      dateAuthored,
      quoteLink,
    };
  });
  return returnData;
};

export async function getDesignQuote() {
  const lastUpdated = getData('quoteLastUpdated');
  let apiData = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(6, 'hour');
    if (dayjs().isAfter(nextUpdateTime) || lastUpdated === null) {
      apiData = await getDesignQuoteData();
      apiData = normalizeQuoteData(apiData);
      clearData('quoteData');
      clearData('quoteLastUpdated');
      setData('quoteData', apiData);
      setData('quoteLastUpdated', dayjs());
    } else {
      apiData = getData('quoteData');
    }
  } else {
    apiData = await getDesignQuoteData();
    apiData = normalizeQuoteData(apiData);
    clearData('quoteData');
    clearData('quoteLastUpdated');
    setData('quoteData', apiData);
    setData('quoteLastUpdated', dayjs());
  }

  return apiData;
}

export async function initDesignQuote() {
  const designQuoteData = await getDesignQuote();
  const randomQuoteNumber = Math.floor(Math.random() * (designQuoteData.length - 1));
  const designQuote = designQuoteData[randomQuoteNumber];
  const designQuoteHtml = `
    ${designQuote.quoteHtml}
    <p class="quote-author">&mdash; ${designQuote.quoteAuthor}</p>
  `;
  const quoteElement = document.querySelector('.quote-container');
  quoteElement.innerHTML = designQuoteHtml;
}

const axios = require('axios').default;
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const postsData = await axios.get('https://www.github.com/trending')
    .then((response) => {
      const markup = response.data;
      const rowSelector = 'body > div.application-main > main > div.explore-pjax-container.container-lg.p-responsive.pt-6 > div > div:nth-child(2) > article';
      const linkTitleSelector = 'h1 > a';
      const descriptionSelector = 'p';
      const languageSelector = 'div.f6.text-gray.mt-2 > span.d-inline-block.ml-0.mr-3';
      const starsSelector = 'div.f6.text-gray.mt-2 > a:nth-child(2)';
      const forksSelector = 'div.f6.text-gray.mt-2 > a:nth-child(3)';
      const starsTodaySelector = 'div.f6.text-gray.mt-2 > span.d-inline-block.float-sm-right';
      const $ = cheerio.load(markup);
      const returnData = [];
      $(rowSelector).each((i, elem) => {
        const title = $(elem).find(linkTitleSelector).attr('href').substring(1);
        const link = `https://www.github.com${$(elem).find(linkTitleSelector).attr('href')}`;
        const description = $(elem).find(descriptionSelector).text().replace(/\r?\n|\r/, '').trim();
        const forksLink = `https://www.github.com${$(elem).find(forksSelector).attr('href')}`;
        const starsLink = `https://www.github.com${$(elem).find(starsSelector).attr('href')}`;
        const stars = $(elem).find(starsSelector).text().replace(/\r?\n|\r/, '').trim();
        const forks = $(elem).find(forksSelector).text().replace(/\r?\n|\r/, '').trim();
        const starsToday = $(elem).find(starsTodaySelector).text().replace(/\r?\n|\r/, '').trim();
        const language = $(elem).find(languageSelector).html();
        let languageMarkup = '';
        if (language) {
          languageMarkup = language.replace(/\r?\n|\r/, '').trim();
        }

        returnData.push({
          title,
          description,
          stars,
          starsLink,
          forks,
          forksLink,
          starsToday,
          languageMarkup,
          link,
        });
      });
      return returnData;
    }).catch((error) => {
      console.error(error);
      callback(null, {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(error),
      });
    });
  callback(null, {
    statusCode: 200,
    headers: callbackHeaders,
    body: JSON.stringify(postsData),
  });
};
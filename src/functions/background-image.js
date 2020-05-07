const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const {
    UNSPLASH_ACCESS_KEY,
  } = process.env;

  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // [x] 327760 - nature
  // [x] 219941 - architecture/buildings/spaces
  // [x] 894 - earth/planets
  // [ ] 1976082 - city views
  // [ ] 461370 - city/street
  // [x] 784236 - city
  // [ ] 1079798 - street art
  // [ ] 4332580 - space
  // [x] 535285 - starry nights/space
  const unsplashCollections = '327760,219941,894,784236,535285';
  // gets a random imagee from a nature collection with over 1200 images in it
  const unsplashApiurl = `https://api.unsplash.com/photos/random/?collections=${unsplashCollections}&orientation=landscape&count=5&client_id=${UNSPLASH_ACCESS_KEY}`;

  const imageData = await axios.get(unsplashApiurl)
    .then((response) => {
      return response;
    }).catch((error) => {
      console.error(error);
      callback(null, {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(error),
      });
    });
  callback(null, {
    statusCode: imageData.status,
    headers: callbackHeaders,
    body: JSON.stringify(imageData.data),
  });
};

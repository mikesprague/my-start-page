const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const {
    UNSPLASH_ACCESS_KEY,
  } = process.env;

  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // gets a random imagee from a nature collection with over 1200 images in it
  const unsplashApiurl = `https://api.unsplash.com/photos/random/?collections=327760&orientation=landscape&count=5&client_id=${UNSPLASH_ACCESS_KEY}`;

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

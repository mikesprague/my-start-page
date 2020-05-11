const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const postsData = await axios.get('https://www.producthunt.com/feed?category=undefined', {
    responseType: 'document',
  })
    .then((response) => {
      // console.log(response);
      return response.data;
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
    body: postsData,
  });
};

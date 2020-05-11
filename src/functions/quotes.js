const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const quotesData = await axios.get('https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand')
    .then((response) => {
      // console.log(response);
      return response.data;
    }).catch((error) => {
      console.error(error);
      return {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(error),
      };
    });
  return {
    statusCode: 200,
    headers: callbackHeaders,
    body: JSON.stringify(quotesData),
  };
};

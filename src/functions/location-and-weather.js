const rp = require('request-promise');

exports.handler = (event, context, callback) => {
  const { lat, lng } = event.queryStringParameters;
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!lat) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: 'Missing "lat" parameter',
    });
  }
  if (!lng) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: 'Missing "lng" parameter',
    });
  }

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
  } = process.env;

  const units = event.queryStringParameters.units || 'auto';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}/?units=${units}`;

  const geocodeOptions = {
    uri: geocodeApiUrl,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  const geocodePromise = rp(geocodeOptions)
    .then((response) => {
      const fullResults = response.results;
      const formattedAddress = response.results[0].formatted_address;
      let locationName = '';
      const addressTargets = ['neighborhood', 'locality', 'administrative_area_level_2', 'administrative_area_level_1'];
      addressTargets.map((target) => {
        if (!locationName.length) {
          response.results.map((result) => {
            if (!locationName.length) {
              result.address_components.map((component) => {
                if (!locationName.length && component.types.indexOf(target) > -1) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });
      if (locationName.length) {
        // console.log(locationName);
        const locationData = {
          location: {
            locationName,
            formattedAddress,
            fullResults,
          },
        };
        return locationData;
      }
    })
    .catch((err) => {
      console.log(err);
      callback(Bugsnag.notify(err), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
      });
    });

  const weatherOptions = {
    uri: weatherApiUrl,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  const weatherPromise = rp(weatherOptions)
    .then((response) => {
      const weatherData = {
        weather: response,
      };
      return weatherData;
    })
    .catch((err) => {
      callback(console.log(err), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
      });
    });

  Promise.all(
    [geocodePromise, weatherPromise],
  ).then((response) => {
    callback(null, {
      statusCode: 200,
      headers: callbackHeaders,
      body: JSON.stringify(response),
    });
  }).catch((err) => {
    callback(console.log(err), {
      statusCode: 500,
      headers: callbackHeaders,
      body: JSON.stringify(err),
    });
  });
};

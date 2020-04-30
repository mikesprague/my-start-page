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
    CLIMACELL_API_KEY,
  } = process.env;

  const units = event.queryStringParameters.units || 'us';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const climacellApiURLPrefix = 'https://api.climacell.co/v3/weather';
  const climacellApiUrls = {
    realtime: `${climacellApiURLPrefix}/realtime?lat=${lat}&lon=${lng}&unit_system=${units}&fields=precipitation,precipitation_type,temp,feels_like,dewpoint,wind_speed,wind_gust,baro_pressure,visibility,humidity,wind_direction,sunrise,sunset,cloud_cover,cloud_ceiling,cloud_base,surface_shortwave_radiation,moon_phase,weather_code&apikey=${CLIMACELL_API_KEY}`,
    nowcast: `${climacellApiURLPrefix}/nowcast?lat=${lat}&lon=${lng}&unit_system=${units}&timestep=1&start_time=now&fields=precipitation,precipitation_type,temp,feels_like,dewpoint,wind_speed,wind_gust,baro_pressure,visibility,humidity,wind_direction,sunrise,sunset,cloud_cover,cloud_ceiling,cloud_base,surface_shortwave_radiation,weather_code&apikey=${CLIMACELL_API_KEY}`,
    hourly: `${climacellApiURLPrefix}/hourly?lat=${lat}&lon=${lng}&unit_system=${units}&start_time=now&fields=precipitation,precipitation_type,precipitation_probability,temp,feels_like,dewpoint,wind_speed,wind_gust,baro_pressure,visibility,humidity,wind_direction,sunrise,sunset,cloud_cover,cloud_ceiling,cloud_base,surface_shortwave_radiation,moon_phase,weather_code&apikey=${CLIMACELL_API_KEY}`,
    daily: `${climacellApiURLPrefix}/daily?lat=${lat}&lon=${lng}&unit_system=${units}&start_time=now&fields=precipitation,precipitation_accumulation,temp,feels_like,wind_speed,baro_pressure,visibility,humidity,wind_direction,sunrise,sunset,moon_phase,weather_code&apikey=${CLIMACELL_API_KEY}`,
  };

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
    uri: climacellApiUrls.realtime,
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

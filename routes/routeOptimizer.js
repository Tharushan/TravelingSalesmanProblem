const routes = require('express').Router();
const axios = require('axios');
const _ = require('lodash');
const { apiKey } = require('config');

const getDistance = async ({ origins, destinations, key }) => {
  const googleMapDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
  try {
    const { data } = await axios.get(googleMapDistance);
    return data;
  } catch (e) {
    throw new Error('Error calculating distance between points');
  }
};

routes.post('/', async (req, res) => {
  const { home, tasks } = req.body;
  const departurePosition = `${home.lat},${home.lng}`;
  const tasksPositions = _.join(
    _.map(tasks, ({ lat, lng }) => `${lat},${lng}`),
    '|'
  );

  try {
    const distance = await getDistance({
      origins: `${departurePosition}|${tasksPositions}`,
      destinations: `${departurePosition}|${tasksPositions}`,
      key: apiKey
    });
    return res.status(200).json(distance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
});

module.exports = routes;

const axios = require('axios');
const _ = require('lodash');
const config = require('config');

class RouteOptimizerController {
  get config() {
    if (!this._config) {
      this._config = config;
    }
    return this._config;
  }

  get requestManager() {
    if (!this._requestManager) {
      this._requestManager = axios;
    }
    return this._requestManager;
  }

  async _getDistance({ origins, destinations, key }) {
    const googleMapDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
    try {
      const { data } = await this.requestManager.get(googleMapDistance);
      return data;
    } catch (e) {
      throw new Error(
        `Error calculating distance between points : ${e.message}`
      );
    }
  }

  _formatPosition({ lat, lng }) {
    return `${lat},${lng}`;
  }

  async post(req, res) {
    const { home, tasks } = req.body;
    const departurePosition = this._formatPosition(home);
    const tasksPositions = _.join(_.map(tasks, this._formatPosition), '|');

    try {
      const { status, rows } = await this._getDistance({
        origins: `${departurePosition}|${tasksPositions}`,
        destinations: `${departurePosition}|${tasksPositions}`,
        key: this.config.apiKey
      });

      if (status !== 'OK') {
        throw new Error(
          `Error getting distances between each points ${status}`
        );
      }

      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RouteOptimizerController;

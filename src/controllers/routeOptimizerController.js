const axios = require('axios');
const _ = require('lodash');
const config = require('config');
const moment = require('moment');

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

  async _getDistance({ origins, destinations, key, departureTime }) {
    const googleMapDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}&departure_time=${departureTime}`;
    try {
      const { data } = await this.requestManager.get(googleMapDistance);
      return data;
    } catch (e) {
      throw new Error(
        `Error calculating distance between points : ${e.message}`
      );
    }
  }

  _getClosestDestination(elements, alreadyDone) {
    const closestDestination = {
      index: undefined,
      travelInformation: {}
    };
    _.forEach(elements, (element, index) => {
      const duration = _.get(element, 'duration.value');
      const actualShortest = _.get(
        closestDestination,
        'travelInformation.duration.value'
      );
      if (
        duration > 0 && // closest destination not same as actual destination
        (duration < actualShortest || !actualShortest) && // Check for first loop if no closestDestination found
        !_.includes(alreadyDone, index) && // Check if job is not already done
        index !== 0 // back home will always be last
      ) {
        closestDestination.index = index;
        closestDestination.travelInformation = element;
      }
    });
    if (_.isNil(closestDestination.index) && !_.isEmpty(alreadyDone)) {
      // get back home
      closestDestination.index = 0;
      closestDestination.travelInformation = _.get(elements, 0);
    }
    return closestDestination;
  }

  _orderJobs({ rows, locations }) {
    const alreadyDone = [];
    const jobs = [];
    let actualJob = 0;
    while (_.size(alreadyDone) < _.size(locations)) {
      const { elements } = _.get(rows, actualJob);
      const closestDestination = this._getClosestDestination(
        elements,
        alreadyDone
      );
      alreadyDone.push(closestDestination.index);
      actualJob = closestDestination.index;
      jobs.push(closestDestination);
    }
    return jobs;
  }

  _formatSchedules({ jobs, tasks, departureTime }) {
    const schedule = _.reduce(
      _.initial(jobs),
      (acc, current) => {
        const startTime =
          _.get(_.last(acc.schedule), 'endsAt') || _.parseInt(departureTime);
        const task = _.get(tasks, current.index - 1); // Because we don't count from home
        const travelDuration = _.get(
          current,
          'travelInformation.duration.value'
        );
        const startsAt = startTime + travelDuration;
        acc.schedule.push({
          id: task.id,
          startsAt,
          endsAt: startsAt + _.parseInt(task.duration) * 60
        });
        acc.totalTime =
          acc.totalTime + _.parseInt(task.duration) * 60 + travelDuration;
        return acc;
      },
      {
        totalTime: 0,
        schedule: []
      }
    );
    schedule.totalTime = _.round(schedule.totalTime / 60);
    return schedule;
  }

  _formatPosition({ lat, lng }) {
    return `${lat},${lng}`;
  }

  async post(req, res) {
    const {
      departureTime = moment()
        .add(1, 'second')
        .format('X'),
      home,
      tasks
    } = req.body;
    const departure = moment(_.parseInt(departureTime), 'X');

    if (departure.isBefore(moment())) {
      return res.status(400).json({
        error: 'departureTime must be a date in the future or a current time.'
      });
    }
    const departurePosition = this._formatPosition(home);
    const tasksPositions = _.join(_.map(tasks, this._formatPosition), '|');
    const locations = [home, ...tasks];

    try {
      const { status, rows } = await this._getDistance({
        origins: `${departurePosition}|${tasksPositions}`,
        destinations: `${departurePosition}|${tasksPositions}`,
        key: this.config.apiKey,
        departureTime
      });

      if (status !== 'OK') {
        throw new Error(
          `Error getting distances between each points ${status}`
        );
      }

      const jobs = this._orderJobs({ rows, locations });
      const schedule = this._formatSchedules({ jobs, tasks, departureTime });
      return res.status(200).json(schedule);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RouteOptimizerController;

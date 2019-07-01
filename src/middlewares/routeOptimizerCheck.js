const validator = require('jjv')();
const _ = require('lodash');

validator.addSchema('routeOptimizerBody', {
  type: 'object',
  properties: {
    departureTime: { type: 'string' },
    home: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      },
      required: ['lat', 'lng']
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          lat: { type: 'number' },
          lng: { type: 'number' },
          duration: { type: 'number' }
        },
        required: ['id', 'lat', 'lng', 'duration']
      }
    }
  },
  required: ['home', 'tasks']
});
module.exports = (req, res, next) => {
  const errors = validator.validate('routeOptimizerBody', req.body);
  if (!_.isEmpty(errors)) {
    return res.status(400).json({
      error: `Validation failed for param(s): ${_.keys(errors.validation)}`
    });
  }

  return next();
};

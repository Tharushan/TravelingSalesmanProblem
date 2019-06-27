const sinon = require('sinon');
const should = require('should');

const RouteOptimizerController = require('../../src/controllers/routeOptimizerController');

describe('Unit tests', () => {
  describe('RouteOptimizerController', () => {
    describe('RouteOptimizerController.config', () => {
      it('should return config object', () => {
        const controller = new RouteOptimizerController();
        controller.config.should.be.an.Object();
      });

      it('should return config string', () => {
        const controller = new RouteOptimizerController();
        controller._config = 'config';
        controller.config.should.eql('config');
      });
    });
  });
});

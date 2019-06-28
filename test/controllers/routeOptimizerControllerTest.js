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

    describe('RouteOptimizerController.requestManager', () => {
      it('should return requestManager object', () => {
        const controller = new RouteOptimizerController();
        controller.requestManager.should.be.a.Function();
      });

      it('should return requestManager string', () => {
        const controller = new RouteOptimizerController();
        controller._requestManager = 'requestManager';
        controller.requestManager.should.eql('requestManager');
      });
    });

    describe('RouteOptimizerController._getDistance({ origins, destinations, key })', () => {
      it('should call requestManager.get and return data', async () => {
        const controller = new RouteOptimizerController();
        const get = sinon
          .stub(controller.requestManager, 'get')
          .resolves({ data: 'data'});
        const result = await controller._getDistance({});
        result.should.eql('data');
        get.calledOnce.should.be.true();
        get.restore();
      });

      it('should call requestManager.get and throw error ', async () => {
        const controller = new RouteOptimizerController();
        const get = sinon
          .stub(controller.requestManager, 'get')
          .rejects('Error unknown');
        controller._getDistance({}).should.be.rejected();
        get.calledOnce.should.be.true();
        get.restore();
      });
    });

    describe('RouteOptimizerController._formatPosition({ lat, lng })', () => {
      it('should return formatted lat,lng', () => {
        const controller = new RouteOptimizerController();
        controller
          ._formatPosition({ lat: 'lat', lng: 'lng'})
          .should.be.eql('lat,lng');
      });
    });
  });
});

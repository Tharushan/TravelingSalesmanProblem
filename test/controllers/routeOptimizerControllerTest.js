const sinon = require('sinon');
const should = require('should');
const mock = require('../mocks/getDistance.json');

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

    describe('RouteOptimizerController._getDistance({ origins, destinations, key, departureTime })', () => {
      it('should call requestManager.get and return data', async () => {
        const controller = new RouteOptimizerController();
        const get = sinon
          .stub(controller.requestManager, 'get')
          .resolves({ data: 'data' });
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

    describe('RouteOptimizerController._getClosestDestination(elements, alreadyDone)', () => {
      it('should return empty closest destination', () => {
        const controller = new RouteOptimizerController();
        controller._getClosestDestination([], []).should.be.eql({
          index: undefined,
          travelInformation: {}
        });
      });

      it('should return closest destination', () => {
        const controller = new RouteOptimizerController();
        controller
          ._getClosestDestination(
            [
              {
                duration: { text: '28 mins', value: 1690 }
              },
              {
                duration: { text: '27 mins', value: 1632 }
              },
              {
                duration: { text: '38 mins', value: 2304 }
              },
              {
                duration: { text: '1 min', value: 0 }
              }
            ],
            []
          )
          .should.be.eql({
            index: 1,
            travelInformation: {
              duration: { text: '27 mins', value: 1632 }
            }
          });
      });

      it('should return home destination', () => {
        const controller = new RouteOptimizerController();
        controller
          ._getClosestDestination(
            [
              {
                duration: { text: '28 mins', value: 1690 }
              },
              {
                duration: { text: '27 mins', value: 1632 }
              },
              {
                duration: { text: '38 mins', value: 2304 }
              },
              {
                duration: { text: '1 min', value: 0 }
              }
            ],
            [1, 2]
          )
          .should.be.eql({
            index: 0,
            travelInformation: {
              duration: { text: '28 mins', value: 1690 }
            }
          });
      });
    });

    describe('RouteOptimizerController._formatPosition({ lat, lng })', () => {
      it('should return formatted lat,lng', () => {
        const controller = new RouteOptimizerController();
        controller
          ._formatPosition({ lat: 'lat', lng: 'lng' })
          .should.be.eql('lat,lng');
      });
    });

    describe('RouteOptimizerController._orderJobs({ rows, locations })', () => {
      it('should return value from _getClosestDestination', () => {
        const controller = new RouteOptimizerController();
        sinon
          .stub(controller, '_getClosestDestination')
          .callsFake(() => ({ index: 1 }));
        controller
          ._orderJobs({
            rows: [{ elements: [] }],
            locations: [
              {
                id: 1,
                lat: 48.8623348,
                lng: 2.3447356000000354,
                duration: 45
              }
            ]
          })
          .should.eql([{ index: 1 }]);
      });

      it('should return empty array', () => {
        const controller = new RouteOptimizerController();
        controller
          ._orderJobs({
            rows: [],
            locations: []
          })
          .should.eql([]);
      });
    });

    describe('RouteOptimizerController._formatSchedules({ jobs, tasks, departureTime })', () => {
      it('should return empty schedule', () => {
        const controller = new RouteOptimizerController();
        controller
          ._formatSchedules({
            jobs: [],
            tasks: [],
            departureTime: 1
          })
          .should.eql({ totalTime: 0, schedule: [] });
      });

      it('should return empty schedule', () => {
        const controller = new RouteOptimizerController();
        controller
          ._formatSchedules({
            jobs: [
              {
                index: 1,
                travelInformation: { duration: { value: 120 } }
              },
              {
                index: 0,
                travelInformation: { duration: { value: 1 } }
              }
            ],
            tasks: [
              {
                id: 1,
                lat: 48.8623348,
                lng: 2.3447356000000354,
                duration: 45
              },
              {
                id: 2,
                lat: 48.7623348,
                lng: 2.3457356000000354,
                duration: 35
              }
            ],
            departureTime: 0
          })
          .should.eql({
            totalTime: 47,
            schedule: [
              {
                id: 1,
                startAt: 120,
                endAt: 2820
              }
            ]
          });
      });
    });

    describe('RouteOptimizerController.post(req, res)', () => {
      it('should return 200', async () => {
        const controller = new RouteOptimizerController();
        const status = sinon.stub();
        const json = sinon.spy();
        const res = { json, status };
        status.returns(res);
        const _formatPosition = sinon.spy(controller, '_formatPosition');
        const _getDistance = sinon
          .stub(controller, '_getDistance')
          .returns(mock);
        const _orderJobs = sinon.stub(controller, '_orderJobs').returns([]);
        const _formatSchedules = sinon
          .stub(controller, '_formatSchedules')
          .returns({ schedule: 'mocked' });
        await controller.post(
          {
            body: {
              home: { lat: 1, lng: 1 },
              tasks: [{ lat: 2, lng: 2 }]
            }
          },
          res
        );
        // controller._formatPosition.calledOnce.should.be.true();
        sinon.assert.calledOnce(json);
        _formatPosition.firstCall.args[0].should.be.eql({ lat: 1, lng: 1 });
        status.calledWith(200).should.be.true();
        json.calledWith({ schedule: 'mocked' }).should.be.true();
        _getDistance.restore();
        _orderJobs.restore();
        _formatSchedules.restore();
      });

      it('should return 500', async () => {
        const controller = new RouteOptimizerController();
        const status = sinon.stub();
        const json = sinon.spy();
        const res = { json, status };
        status.returns(res);
        const _formatPosition = sinon.spy(controller, '_formatPosition');
        const _getDistance = sinon
          .stub(controller, '_getDistance')
          .returns({ status: 'notOK' });
        await controller.post(
          {
            body: {
              home: { lat: 1, lng: 1 },
              tasks: [{ lat: 2, lng: 2 }]
            }
          },
          res
        );
        sinon.assert.calledOnce(json);
        _formatPosition.firstCall.args[0].should.be.eql({ lat: 1, lng: 1 });
        status.calledWith(500).should.be.true();
        _getDistance.restore();
      });

      it('should return 400', async () => {
        const controller = new RouteOptimizerController();
        const status = sinon.stub();
        const json = sinon.spy();
        const res = { json, status };
        status.returns(res);
        const _getDistance = sinon
          .stub(controller, '_getDistance')
          .returns({ status: 'notOK' });
        await controller.post(
          {
            body: {
              departureTime: 1,
              home: { lat: 1, lng: 1 },
              tasks: [{ lat: 2, lng: 2 }]
            }
          },
          res
        );
        sinon.assert.calledOnce(json);
        status.calledWith(400).should.be.true();
        _getDistance.restore();
      });
    });
  });
});

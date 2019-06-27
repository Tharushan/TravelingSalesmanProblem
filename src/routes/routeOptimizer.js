const routes = require('express').Router();
const RouteOptimizerController = require('../controllers/routeOptimizerController');
const routeOptimizerCheck = require('../middlewares/routeOptimizerCheck');

const routeOptimizer = new RouteOptimizerController();

routes.post('/', routeOptimizerCheck, (req, res) =>
  routeOptimizer.post(req, res)
);

module.exports = routes;

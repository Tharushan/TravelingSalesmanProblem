const routes = require('express').Router();
const RouteOptimizerController = require('../controllers/routeOptimizerController');

const routeOptimizer = new RouteOptimizerController();

routes.post('/', (req, res) => routeOptimizer.post(req, res));

module.exports = routes;

const routes = require('express').Router();
const RouteOptimizerController = require('../controllers/routeOptimizerController');
const routeOptimizerCheck = require('../middlewares/routeOptimizerCheck');

const routeOptimizer = new RouteOptimizerController();

/**
 * @swagger
 * /routeOptimizer:
 *   post:
 *     tags:
 *       - routeOptimizer
 *     description: Returns optimized itinerary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *              departureTime:
 *                type: string
 *              home:
 *                type: object
 *                properties:
 *                  lat:
 *                    type: number
 *                  lng:
 *                    type: number
 *              tasks:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                    lat:
 *                      type: number
 *                    lng:
 *                      type: number
 *                    duration:
 *                      type: number
 *           example:
 *             departureTime: '1508756400'
 *             home:
 *               lat: 48.83310530000001
 *               lng: 2.333563799999979
 *             tasks:
 *             - id: 1
 *               lat: 48.8623348
 *               lng: 2.3447356000000354
 *               duration: 45
 *             - id: 2
 *               lat: 48.879251
 *               lng: 2.282264899999973
 *               duration: 60
 *             - id: 3
 *               lat: 48.7251521
 *               lng: 2.259899799999971
 *               duration: 30
 *             - id: 4
 *               lat: 48.83477
 *               lng: 2.370769999999993
 *               duration: 90
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returned optimized itinerary
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 totalTime:
 *                   type: integer
 *                 schedule:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                       startsAt:
 *                         type: number
 *                       endsAt:
 *                         type: number
 *       400:
 *         description: Bad Format
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server Error
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 */

routes.post('/', routeOptimizerCheck, (req, res) =>
  routeOptimizer.post(req, res)
);

module.exports = routes;

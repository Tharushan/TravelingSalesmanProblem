const app = require('express')();
const bodyParser = require('body-parser');
const { port, host } = require('config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routeOptimizer = require('./src/routes/routeOptimizer');

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Traveling Salesman Problem',
      version: '1.0.0',
      description:
        'Simple API that computes an optimized itinerary solving the Traveling Salesman Problem'
    },
    host: `${host}:${port}`,
    basePath: '/'
  },
  apis: ['./src/routes/*.js']
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use('/routeOptimizer', routeOptimizer);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, host, () => {
  console.log('App listening on %s:%i', host, port);
});

const app = require('express')();
const bodyParser = require('body-parser');

const { port, host } = require('config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.listen(port, host, () => {
  console.log('App listening on %s:%i', host, port);
});
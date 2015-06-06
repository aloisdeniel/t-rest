var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var config = require('./config');
var Model = require('./model/Model.js');
var Controller = require('./controller/Controller.js');
var route = require('./route/');
var SpecController = require('./controller/SpecController.js');
var specRoute = require('./route/spec.js');
var requireDir = require('require-dir');

var app = express();

app.use(bodyParser.json());

var server = {
  app: app,
  generators: {},
  models: {},
  controllers: {},
  listen: function(port) {
    port = port || config.port;
    app.listen(port);
		console.log(('[t-rest] Server listening on port ' + port + ' ...').cyan);
  }
};

try {
  server.generators = requireDir(path.join(process.cwd(), 'generators'));
}
catch (e){}

var spec = {
    version : config.version,
    title: config.title,
    description: config.description,
    routes: []
};

var normalizedPath = path.join(process.cwd(), "entities");

var schemas = [];
fs.readdirSync(normalizedPath).forEach(function(file) {
  var data = fs.readFileSync( path.join(process.cwd(), "entities/" + file),'utf8');
  var s = yaml.safeLoad(data);
  s.basename = path.basename(file, '.yaml');
  s.path = "/" + s.basename;
  schemas.push(s);
});

for (var index in schemas) {
  var schema = schemas[index];
  var model = new Model(schema,server.generators[schema.basename]);
  var controller = new Controller(model);
  server.models[model.name] = controller;
  server.controllers[model.name] = controller;
  var routeSpec = route(app,controller);
  spec.routes.push(routeSpec);
}

var specController = new SpecController(spec);
specRoute(app,specController);

// Swagger-UI
app.use('/ui', express.static(__dirname + '/node_modules/swagger-ui/dist'));
app.get('/', function(req,res) {
  var specUrl = encodeURIComponent('http://' + req.hostname + ':' + config.port + config.root);
  res.redirect('/ui/index.html?url='+specUrl);
});

module.exports = server;

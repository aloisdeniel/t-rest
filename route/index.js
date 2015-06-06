var pathes = require('path');
var config = require('../config')
var pluralize = require('pluralize');

/**
 * Registers all route for a given  model's controller.
 * @param app The express application instance.
 * @param controller The controller.
 */
module.exports = function (app,controller) {
 
  var rootPath = config.root;
  var path = pathes.join(rootPath,controller.model.schema.path);
  var pathId = path + '/:id';

  app.get(path, function(req,res) { controller.all(req,res); });
  app.put(path, function(req,res) { controller.create(req,res); });
  app.delete(pathId, function(req,res) { controller.delete(req,res); });
  app.get(pathId, function(req,res) { controller.all(req,res); });
  app.post(pathId, function(req,res) {  controller.update(req,res); });
  app.put(path + '/generate', function(req,res) { controller.generate(req,res); });
  
  // Spec
  
  var single = controller.model.name;
  var plural = pluralize(single);
  
  return {
    single: single,
    plural: plural,
    path: path,
    schema: JSON.stringify(controller.model.schema)
  };
};

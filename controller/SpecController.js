var mustache = require('mustache');
var yaml = require('js-yaml');
var fs = require('fs');

/**
 * Class definition
 */

function SpecController(spec) {
  var specTemplate = fs.readFileSync(__dirname + '/../views/spec.yaml','utf8');
  var yamlSpec = mustache.render(specTemplate.toString(),spec); 
  
  /**
   * Specification
   */
  this.spec = yaml.safeLoad(yamlSpec);
  var specResponse = this.spec;
  
  /**
   * Gets the specification
   */
  this.get = function (req,res) {
    res.json(specResponse);
  };
};



/**
 * Exposes the class.
 */
module.exports = SpecController;


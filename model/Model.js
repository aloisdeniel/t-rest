/**
 * Module's dependencies
 */

var path = require('path');
var uuid = require('uuid');
var low = require('lowdb');
var fs = require('fs');
var faker = require('json-schema-faker');
var changeCase = require('change-case');
var schemaEnvironment = require("JSV").JSV.createEnvironment();

/**
 * A model represents a collection of persisted entities that all validates the
 * same object schema.
 * @param schema The JSON Schema that is used to validate the inserted entities.
 */
function Model(schema,generator) {
  this.name = changeCase.camelCase(schema.title);
  this.schema = schema;
  this.generator = generator;

  var dbPath = path.resolve(process.cwd(), 'data/db.json');
  var dbFolder = path.dirname(dbPath);

  if (!fs.existsSync(dbFolder)){
      fs.mkdirSync(dbFolder);
  }

  this.database = low(dbPath);
};

Model.prototype.collection = function(entity) {
    return this.database(this.name);
};

/**
 * Validating the structure of a given entity.
 * @return True if the schema is valid, else false.
 */
Model.prototype.validate = function(entity) {
  if(!entity)
    return false;

  var report = schemaEnvironment.validate(entity, this.schema);

  if(report.errors.length === 0)
    return false;

  return report.errors;
}

/**
 * Gets all the entities from the database.
 * @param offset The starting offset of the range of retrieved entities.
 * @param limit The max number of entities to retrieve.
 * @return An array of entities.
 */
Model.prototype.all = function(offset,limit) {

  var total = this.count();

  if(total === 0)
    return [];

  var start = Math.max(0,Math.min(offset,total-1));
  limit = limit || (total-start);
  var end = Math.max(0,Math.min(offset+limit,total));

  return this.collection().chain().slice(start,end).value();
}

/**
 * Inserts a new entity into the database.
 * @param entity The valid entity that will be inserted into the database.
 * @return The entity from the database (with its newly created 'id' field).
 */
Model.prototype.create = function(entity) {

  var errors = this.validate(entity);

  if(errors) {
    throw new Error('Invalid entity :' + JSON.stringify(errors));
  }

  entity.id = uuid();
  this.collection().push(entity);
  return this.read(entity.id);
};

/**
 * Updates an existing entity from the database.
 * @param entity The updated entity with all the modified fields.
 */
Model.prototype.update = function(entity) {

  if(!entity || !entity.id)  {
    throw new Error('Missing fields for updating an entity');
  }

  // Keeping id and removing it from values.
  var id = entity.id;
  delete entity.id;

  return this.collection().chain().find({ id: id }).assign(entity).value();
};

/**
 * Deletes an entity from the database.
 * @param id The identifier of the deleted entity.
 */
Model.prototype.delete = function(id) {

  if(!id) {
    throw new Error('Missing identifier parameter for deleting an entity');
  }

  this.collection().remove({ id: id });
};

/**
 * Gets an entity from the database.
 * @param id The identifier of the read entity.
 * @return The found entity with corresponding identifier.
 */
Model.prototype.read = function(id) {

  if(!id) {
    throw new Error('Missing identifier parameter for reading an entity');
  }

  return this.collection().find({ id: id });
}

/**
 * Generates random fake entities and inserts it into database.
 * @param number The number of entities to generate (optionnal, default: 1).
 * @return An array containing the generate entities.
 */
Model.prototype.generate = function(number) {
  number = number || 1;

  var result = [];

  for (var i = 0; i < number; i++) {
    
    var entity = null;
    
    if(this.generator) {
      entity = this.generator();
    }
    else {
      entity = faker(this.schema);
    }
    
    entity = this.create(entity);
    result.push(entity);
  }

  return result;
}

/**
 * Gets the total number of entities into the database.
 * @return The total count of entities.
 */
Model.prototype.count = function() {
  return this.collection().size();
}

/**
 * Exposes the class.
 */
module.exports = Model;

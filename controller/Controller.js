/**
 * A controller extracts and translate all data of an HTTP request in order to
 * an associated model.
 * @param model The model to which to the controller can access.
 */
function Controller(model) {
  this.model = model;
};

/**
 * Gets all the entities.
 */
Controller.prototype.all = function (req,res) {
  try {

    var total = this.model.count();

    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    offset = isNaN(offset) ? 0 : offset;
    limit = isNaN(limit) ? Math.min(1000,total) : limit;

    var entities = this.model.all(offset, limit);

    var result = {
      values: entities,
      offset: offset,
      limit: limit,
      total: total
    };

    if(limit && offset + limit < total - 1) {
        result.next = {
          offset: offset + limit,
          limit: limit
        };
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

/**
 * Reads one entity.
 */
Controller.prototype.read = function(req,res) {
  try {
    var entity = this.model.read(req.params.id);
    res.json(entity);
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

/**
 * Creates a new entity.
 */
Controller.prototype.create = function(req,res) {
  try {
    var entity = this.model.create(req.body);
    res.json(entity);
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

Controller.prototype.generate = function(req,res) {
  try {
    var n = parseInt(req.query.number);
    n = isNaN(n) ? 1 : n;
    var entities = this.model.generate(n);
    res.json(entities);
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

/**
 * Updates an existing entity.
 */
Controller.prototype.update = function(req,res) {
  try {
    var entity = this.model.update(req.body);
    res.json(entity);
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

/**
 * Deletes an existing entity.
 */
Controller.prototype.delete = function(req,res) {
  try {
    this.model.delete(req.query.id);
    res.json({ message: 'Entity successfuly deleted.'});
  } catch (e) {
    res.status(500).json({
      title: 'Internal error',
      description: e.message
    });
  }
}

/**
 * Exposes the class.
 */
module.exports = Controller;

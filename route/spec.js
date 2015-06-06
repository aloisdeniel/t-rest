var config = require('../config');

module.exports = function (app,specController) {
 app.get(config.root, specController.get);
};

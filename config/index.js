var config = require('config');

var defaults = {
	port: 3000,
	title: 'API',
	description: 'A prototype api.',
	version: '1.0.0',
	root: '/api',
	schemas: null
};

function getValue(key) {
	if(config.has(key)) {
		return config.get(key);
	}
	
	return defaults[key];
}

var values = {};

for (var key in defaults) {
	values[key] = getValue(key)
}

module.exports = values;
/**
 * All the possible values for random generation.
 */
var firstnames = ['John', 'Michael', 'Brandon', 'Zack', 'Dave'];
var lastnames = ['Doe', 'Dynes', 'Johnson', 'Harve', 'Dwyve', 'Kane'];
var emails = ['hosting.com', 'gmail.com', 'yahoo.com', 'outlook.com'];

/**
 * Gets a random value from an array.
 * @param array The array containing all the values.
 */
function randomValue(array) {
   return array[Math.floor(Math.random() * array.length)];
}

/**
 * The custom generator for Users.
 */
module.exports = function() {
	
	var result = {
		firstname: randomValue(firstnames),
		lastname: randomValue(lastnames)
	};
	
	result.email = result.firstname.toLowerCase() + "." + result.lastname.toLowerCase() + "@" + randomValue(emails);
	result.photo = 'http://api.randomuser.me/portraits/men/' + Math.floor((Math.random() * 30) + 1) + '.jpg';
	
	return result;
};

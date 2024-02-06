const cors = require('cors');

const corsOptions = {
	origin: ['http://localhost:3000'],
	methods: 'POST', // Ensure it allows the POST method
};

module.exports = cors(corsOptions);
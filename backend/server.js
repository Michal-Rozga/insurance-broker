const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const apiHandler = require('./apiHandler');
const db = require('./database');

const logStream = fs.createWriteStream('server.log', { flags: 'a' }); // 'a' means append
console.log = (message) => {
	logStream.write(`${new Date().toISOString()} - ${message}\n`);
};

const app = express();
const port = 3001;

const sslOptions = {
	key: fs.readFileSync('/path/to/priv/key.pem'),
	cert: fs.readFileSync('/path/to/cert.pem'),
};

app.use(express.json());
app.use(cors({ origin: 'https://my-domain.com:3001', methods: ['POST', 'GET', 'OPTIONS'] }));

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('/api/insurance', (req, res) => {
	const { postcode, houseNumber } = req.query;

	apiHandler.getInsuranceData(postcode, houseNumber)
		.then((data) => {
			res.json(data);
		})
		.catch((error) => {
			res.status(500).json({ error: 'Error fetching insurance data' });
		});
});

function assign(columnName, values, value) {
	if (value && value !== '') {
		values[columnName] = value;
	}
}

app.post('/api/save-questions', (req, res) => {
	const formData = req.body;
    const values = {};

	assign('postcode', values, formData['postcode']);
	assign('huisnummer', values, formData['huisnummer']);
	assign('premium_avp', values, formData['selectedItems']['PremiumAvp']);
	assign('premium_buiten', values, formData['selectedItems']['PremiumBuiten']);
	assign('premium_inboedel', values, formData['selectedItems']['PremiumInboedel']);
	assign('premium_ongevallen', values, formData['selectedItems']['PremiumOngevallen']);
	assign('premium_rechtsbijstand', values, formData['selectedItems']['PremiumRechtsbijstand']);
	assign('premium_reis', values, formData['selectedItems']['PremiumReis']);
	assign('premium_woonhuis', values, formData['selectedItems']['PremiumWoonhuis']);
	assign('soort_verzekering', values, formData['answers'][0]['formFields']['soortVerzekering'])
	assign('maatschappij_een', values, formData['answers'][0]['formFields']['maatschappij_een']);
	assign('polisnummer', values, formData['answers'][0]['formFields']['polisnummer_een']);
	assign('soort_dekking', values, formData['answers'][0]['formFields']['soortDekking']);
	assign('verzekerd_bedrag', values, formData['answers'][0]['formFields']['verzekerdBedrag']);
	assign('datum', values, formData['answers'][0]['formFields']['einddatum']);
	assign('eventueleOpzegging', values, formData['answers'][0]['formFields']['eventueleOpzegging']);
	assign('uzelf', values, formData['answers'][0]['formFields']['uzelf']);
	assign('intermediair', values, formData['answers'][0]['formFields']['intermediair']);
	assign('aantal_schades', values, formData['answers'][1]['formFields']['aantalSchades']);
	assign('laatste_schadeclaim', values, formData['answers'][1]['formFields']['laatsteSchadeDatum']);
	assign('totaal_bedrag', values, formData['answers'][1]['formFields']['totaalSchadeBedrag']);
	assign('beschrijving', values, formData['answers'][2]['formFields']['expandableTextField']);
	assign('maatschappij_vier', values, formData['answers'][3]['formFields']['maatschappij']);
	assign('polisnummer_vier', values, formData['answers'][3]['formFields']['polisnummer']);
	assign('toelichting', values, formData['answers'][3]['formFields']['toelichting']);




	const insertColumns = Object.keys(values).join(', ');
	const insertValues = Object.values(values);
	const insertPlaceholders = Array.from({length : insertValues.length},() => '?').join(', ' );

	const sql = `
    INSERT INTO general_information (
      ${insertColumns}
    ) VALUES (
      ${insertPlaceholders}
    )
  `;

	// Execute the SQL query with your database connection
	db.query(sql, insertValues, (error, results) => {
		if (error) {
			// Log the error to the file
			console.error(`${new Date().toISOString()} - Error while saving data:`, error);
			res.status(500).json({ error: 'Error while saving data' });
		} else {
			console.log('Data saved successfully');
			res.json({ success: true });
		}
	});
});

// other routes and functionality here

const server = https.createServer(sslOptions, app);

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
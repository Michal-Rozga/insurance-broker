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

function assignValue(target, englishName, formData, dutchPath) {
    const value = dutchPath.split('.').reduce((acc, part) => acc && acc[part], formData);
    if (value && value !== "") {
        target[englishName] = value;
    }
}

app.post("/api/save-questions", (req, res) => {
    const formData = req.body;
    const values = {};

    // Mapping Dutch paths to English column names
    const mapping = {
        "postcode": "postcode",
        "huisnummer": "house_number",
        "selectedItems.PremiumAvp": "premium_avp",
        "selectedItems.PremiumBuiten": "premium_outside",
        "selectedItems.PremiumInboedel": "premium_contents",
        "selectedItems.PremiumOngevallen": "premium_accidents",
        "selectedItems.PremiumRechtsbijstand": "premium_legal",
        "selectedItems.PremiumReis": "premium_travel",
        "selectedItems.PremiumWoonhuis": "premium_home",
        "answers.0.formFields.soortVerzekering": "type_insurance",
        "answers.0.formFields.maatschappij_een": "company_one",
        "answers.0.formFields.polisnummer_een": "policy_number_one",
        "answers.0.formFields.soortDekking": "type_coverage",
        "answers.0.formFields.verzekerdBedrag": "insured_amount",
        "answers.0.formFields.einddatum": "end_date",
        "answers.0.formFields.eventueleOpzegging": "possible_cancellation",
        "answers.0.formFields.uzelf": "yourself",
        "answers.0.formFields.intermediair": "intermediary",
        "answers.1.formFields.aantalSchades": "number_claims",
        "answers.1.formFields.laatsteSchadeDatum": "last_claim_date",
        "answers.1.formFields.totaalSchadeBedrag": "total_claim_amount",
        "answers.2.formFields.expandableTextField": "description",
        "answers.3.formFields.maatschappij": "company_four",
        "answers.3.formFields.polisnummer": "policy_number_four",
        "answers.3.formFields.toelichting": "explanation",
    };

    // Extract values using the mapping
    Object.entries(mapping).forEach(([dutchPath, englishName]) => {
        assignValue(values, englishName, formData, dutchPath);
    });

    const insertColumns = Object.keys(values).join(", ");
    const insertValues = Object.values(values);
    const insertPlaceholders = insertValues.map(() => "?").join(", ");

    const sql = `
    INSERT INTO general_information (
      ${insertColumns}
    ) VALUES (
      ${insertPlaceholders}
    )`;

    // Execute the SQL query with your database connection
    db.query(sql, insertValues, (error, results) => {
        if (error) {
            console.error(`${new Date().toISOString()} - Error while saving data:`, error);
            res.status(500).json({ error: "Error while saving data" });
        } else {
            console.log("Data saved successfully");
            res.json({ success: true });
        }
    });
});

// other routes and functionality here

const server = https.createServer(sslOptions, app);

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
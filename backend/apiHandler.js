const axios = require('axios');
const xml2js = require('xml2js');

function getInsuranceData(postcode, huisnummer) {
	const url = `https://thoma.kiesklaar.nl/webtool.service/premies.asmx/pcPremies?postcode=${postcode}&huisnummer=${huisnummer}`;

	return axios.get(url)
		.then((response) => {
			const xmlData = response.data;
			console.log(`XML Response: ${xmlData}`); // Log the XML response

			return new Promise((resolve, reject) => {
				const parser = new xml2js.Parser({ explicitArray: false });
				parser.parseString(xmlData, (err, result) => {
					if (err) {
						console.error('Error parsing XML response:', err);
						reject(err);
					} else {
						console.log('Parsed Result:', result); // Log the parsed result

						try {
							// Access data based on XML structure
							const responseData = result['DataSet']['diffgr:diffgram']['NewDataSet']['depremie'];
							const responseDataArray = Array.isArray(responseData) ? responseData : [responseData];
							resolve(responseDataArray);
						} catch (err) {
							console.error('Expected properties not found in XML response:', err);
							reject(err);
						}
					}
				});
			});
		})
		.catch((error) => {
			console.error('Error making HTTP request:', error);
			throw error;
		});
}

module.exports = {
	getInsuranceData,
};
import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { useLocation, Link } from 'react-router-dom';
import Table from './Table';
import './styles.css';
import {Breadcrumbs, Button, Typography} from "@mui/material";

function ResultsPage() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const postcode = searchParams.get('postcode');
	const houseNumber = searchParams.get('houseNumber');
	const [product, setProduct] = useState({});
	const [selectedItems, setSelectedItems] = useState({
		PremiumAvp: false,
		PremiumBuiten: false,
		PremiumInboedel: false,
		PremiumOngevallen: false,
		PremiumReis: false,
		PremiumRechtsbijstand: false,
		PremiumWoonhuis: false,
	});
	const [error, setError] = useState(null);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const postcode = searchParams.get('postcode');
		const houseNumber = searchParams.get('houseNumber');

		if (!postcode || !houseNumber) {
			setError('Postcode and/or house number missing in URL.');
			return;
		}

		async function fetchData() {
			try {
				const url = `/api/insurance?postcode=${postcode}&houseNumber=${houseNumber}`;
				const response = await axios.get(url);

				const data = response.data[0]; // Get the first (and only) object from the array
				setProduct(data);
				setSelectedItems({
					PremiumAvp: true,
					PremiumBuiten: true,
					PremiumInboedel: true,
					PremiumOngevallen: true,
					PremiumReis: true,
					PremiumRechtsbijstand: true,
					PremiumWoonhuis: true,
				});

				setError(null);
			} catch (error) {
				console.error('Error:', error);
				setError('An error occurred while fetching the data.');
				setProduct({});
			}
		}

		fetchData();
	}, [location.search]);

	const keyToHumanReadable = {
		PremiumAvp: 'Aansprakelijkheidsverzekering',
		PremiumBuiten: 'Buitenshuisverzekering',
		PremiumInboedel: 'Inboedelverzekering',
		PremiumOngevallen: 'Ongevallenverzekering',
		PremiumReis: 'Reisverzekering',
		PremiumRechtsbijstand: 'Rechtsbijstandverzekering',
		PremiumWoonhuis: 'Woonhuisverzekering',
	};

	const handleCheckboxChange = (propertyName) => {
		setSelectedItems((prevSelectedItems) => ({
			...prevSelectedItems,
			[propertyName]: !prevSelectedItems[propertyName],
		}));
	};

	const totalSelectedValue = Object.keys(selectedItems).reduce((acc, propertyName) => {
		if (selectedItems[propertyName]) {
			return acc + parseFloat(product[propertyName]);
		}
		return acc;
	}, 0);

	const selectedCount = Object.values(selectedItems).filter(value => value).length;
	const lidmaatschap = (selectedCount * 1.25);

	let bruttoPremie = 0;
	let nettoPremie = 0;

	if (totalSelectedValue > 0) {
		bruttoPremie = ((((totalSelectedValue / 0.85) / 0.75 ) * 1.21) * 12).toFixed(2);
		nettoPremie = (((totalSelectedValue / 0.85) * 1.21) * 12).toFixed(2);
	}

	let uwVoordeel = 0;

	if (totalSelectedValue > 0) {
		uwVoordeel = (bruttoPremie - nettoPremie).toFixed(2);
	}

	return (
		<div className="results-page-container">
			<div className="results-page-tables">
				<Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Stap 1: Uw adres
					</Link>
					<Typography underline="hover" color="inherit" to={`/results?postcode=${postcode}&houseNumber=${houseNumber}`}>
						<b>Stap 2: Kies uw producten </b>
					</Typography>
					<Typography underline="hover" color="inherit" to={`/questions?postcode=${postcode}&houseNumber=${houseNumber}&selectedItems=${JSON.stringify(selectedItems)}`}>
						Stap 3: Vragen
					</Typography>
				</Breadcrumbs>
				{Object.keys(product).length > 0 && (
					<div>
						<div className="results-table">
							<Table product={product} selectedItems={selectedItems} onCheckboxChange={handleCheckboxChange} />
						</div>
					</div>
				)}
				<div>
					<div className="table-style">
						<table className="table-container">
							<tbody>
							<tr>
								<td>
									<div style={{fontSize: 20}}><b>Uw Voordeel: € {uwVoordeel}</b></div>
									<div><b>26% Korting op uw jaarlijkse verzekeringspremie (excl. Lidmaatschap)</b></div>
								</td>
							</tr>
							<tr>
								<td>Geselecteerde product:</td>
								<td style={{ height: '200px'}}>
									{Array.from({ length: 7 }).map((_, index) => {
										const propertyName = Object.keys(selectedItems)[index];
										return (
											<div key={index}>
												{selectedItems[propertyName] && (
													keyToHumanReadable[propertyName]
												)}
											</div>
										);
									})}
								</td>
							</tr>
							<tr>
								<td>Brutto Premie per jaar:</td>
								<td>€ {bruttoPremie}</td>
							</tr>
							<tr>
								<td>Netto premie per jaar:</td>
								<td>€ {nettoPremie}</td>
							</tr>
							<tr>
								<td>Lidmaatschap per maand:</td>
								<td>€ {lidmaatschap}</td>
							</tr>
							</tbody>
						</table>
					</div>
					<Link to={`/questions?postcode=${postcode}&houseNumber=${houseNumber}&selectedItems=${JSON.stringify(selectedItems)}`}>
						<Button variant="contained" color="primary" size="large">Aanvragen</Button>
					</Link>
				</div>
			</div>
			{error && <div>{error}</div>}
		</div>
	);
}

export default ResultsPage;
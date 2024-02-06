import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { Button } from "@mui/material";
import {toast, ToastContainer} from "react-toastify";

function FormPage() {
	const navigate = useNavigate();

	const [postcode, setPostcode] = useState('');
	const [houseNumber, setHouseNumber] = useState('');

	const handleFormSubmit = (e) => {
		e.preventDefault();

		if (!postcode || !houseNumber) {
			// Display an error message if either postcode or houseNumber is empty
			toast.error('Vul zowel de postcode als het huisnummer in.', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} else {
			try
			{
				navigate(`/results?postcode=${postcode}&houseNumber=${houseNumber}`);
			} catch (error)
			{
				toast.error('Er is een fout opgetreden bij het opslaan van de gegevens.', {
					position: 'top-center',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		}
	};


	return (
		<div className="form-page-container">
			<div className="background-image"></div>
			<div className="form-container">
				<h2 className="form-title">Check uw voordeel</h2>
				<form className="form-page" onSubmit={handleFormSubmit}>
					<div className="postal-data-div">
						<input
							className="postal-data-input"
							type="text"
							placeholder={'Postal code'}
							value={postcode}
							onChange={(e) => setPostcode(e.target.value)}
						/>
					</div>
					<div className="postal-data-div">
						<input
							className="postal-data-input"
							type="text"
							placeholder={'Huisnummer'}
							value={houseNumber}
							onChange={(e) => setHouseNumber(e.target.value)}
						/>
					</div>
					<div className="postal-data-div">
						<Button variant="contained" color="primary" size="large" type="submit" >
							Aanvragen
						</Button>
					</div>
				</form>
				<ToastContainer />
			</div>
		</div>
	);
}

export default FormPage;
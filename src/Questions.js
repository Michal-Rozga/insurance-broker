import React, { useState } from 'react';
import axios from './axiosConfig';
import {Link, useLocation} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Breadcrumbs, Button, Typography} from "@mui/material";

function Questions() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const postcode = searchParams.get('postcode');
	const houseNumber = searchParams.get('houseNumber');
	const selectedItems = JSON.parse(searchParams.get('selectedItems'));
	
	const initialQuestions = [
		{
			id: 1,
			text: 'Is de aangevraagde verzekering momenteel elders ondergebracht?',
			answers: ['Ja', 'Nee'],
			formFields: {
				soortVerzekering: '',
				maatschappij_een: '',
				polisnummer_een: '',
				soortDekking: '',
				verzekerdBedrag: '',
				einddatum: '',
				eventueleOpzegging: '', // Additional text field
				uzelf: false, // Checkbox
				intermediair: false, // Checkbox
			},
		},
		{
			id: 2,
			text: 'Heeft u, of een andere belanghebbende bij deze verzekering, de laatste 5 jaar schade geleden/toegebracht verband houdende met de aangevraagde verzekeringen?',
			answers: ['Ja', 'Nee'],
			formFields: {
				additionalInfo: '',
				aantalSchades: '',
				laatsteSchadeDatum: '',
				totaalSchadeBedrag: '',
			},
		},
		{
			id: 3,
			text: 'Bent u of een andere belanghebbende bij deze verzekering, in de laatste 8 jaar als verdachte of ter uitvoering van een opgelegde (straf)maatregel, in aanraking geweest met politie of justitie in verband met:',
			answers: ['Ja', 'Nee'],
			formFields: {
				infoText: 'Zo ja, geef dan aan om welk strafbaar feit het ging, of het tot een rechtszaak is gekomen, wat het resultaat daarvan was en of eventuele (straf)maatregelen al ten uitvoer zijn gelegd. Indien het niet tot een rechtszaak is gekomen, geef dan aan of er sprake is geweest van een schikking met het Openbaar Ministerie, en zo ja tegen welke voorwaarden de schikking tot stand kwam.',
				expandableTextField: '',
			},
		},
		{
			id: 4,
			text: 'Heeft enige maatschappij u ooit een verzekering geweigerd, opgezegd of bijzondere voorwaarden aan u gesteld?',
			answers: ['Ja', 'Nee'],
			formFields: {
				maatschappij: '',
				polisnummer: '',
				toelichting: '',
			},
		},
	];

	const resetFormFieldsForQuestion = (questionId) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question) =>
				question.id === questionId
					? {
						...question,
						formFields: resetFieldsByQuestionType(question),
					}
					: question
			)
		);
	};

// Function to reset form fields based on the question type
	const resetFieldsByQuestionType = (question) => {
		const { id, formFields } = question;

		// Define the question types that should reset specific fields
		const resetTypes = {
			1: [
				'soortVerzekering',
				'maatschappij',
				'polisnummer',
				'soortDekking',
				'verzekerdBedrag',
				'einddatum',
				'eventueleOpzegging',
				'uzelf',
				'intermediair',
			],
			2: ['additionalInfo', 'aantalSchades', 'laatsteSchadeDatum', 'totaalSchadeBedrag'],
			3: ['expandableTextField'],
			4: ['maatschappij', 'polisnummer', 'toelichting'],
		};

		// Check if the question type is in resetTypes, then reset the specified fields
		const fieldsToReset = resetTypes[id] || [];
		const resetFormFields = fieldsToReset.reduce(
			(acc, field) => ({
				...acc,
				[field]: '',
			}),
			{}
		);

		return {
			...formFields,
			...resetFormFields,
		};
	};

	const [questions, setQuestions] = useState(initialQuestions);

	// Function to handle answer selection and show/hide form fields
	const handleAnswerSelect = (questionId, selectedAnswer) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question) =>
				question.id === questionId
					? {
						...question,
						formFields: {
							...question.formFields,
							fieldsVisible: selectedAnswer === 'Ja',
							uzelf: false,
							intermediair: false,
						},
					}
					: question
			)
		);

		if (selectedAnswer === 'Nee') {
			resetFormFieldsForQuestion(questionId);
		}
	};

	// Function to handle form submission
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		const selectedItemsToSend = {
			// Include only the properties you want to send to the server
			PremiumAvp: selectedItems.PremiumAvp,
			PremiumBuiten: selectedItems.PremiumBuiten,
			PremiumInboedel: selectedItems.PremiumInboedel,
			PremiumOngevallen: selectedItems.PremiumOngevallen,
			PremiumRechtsbijstand: selectedItems.PremiumRechtsbijstand,
			PremiumReis: selectedItems.PremiumReis,
			PremiumWoonhuis: selectedItems.PremiumWoonhuis,
		};

		const formData = {
			postcode: postcode,
			huisnummer: houseNumber,
			selectedItems: selectedItemsToSend,
			answers: questions.map((question) => ({
				id: question.id,
				selectedAnswer: question.formFields.fieldsVisible ? question.selectedAnswer : 'Nee',
				formFields: question.formFields,
			})),
		};

		try {
			// Send the data to the server
			await axios.post('/api/save-questions', formData);

			// Send data to the a webhook
			await axios.post('https://address-of-the-webhook.com/something', formData);

			// Show success toast
			toast.success('Data is succesvol opgeslagen! U kunt het venster sluiten.', {
				position: 'top-center',
				autoClose: 5000, // Auto close the toast after 5 seconds
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} catch (error) {
			// Show error toast
			toast.error('Er is een fout opgetreden bij het opslaan van de gegevens.', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	return (
		<div className="questions-container">
			<Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Stap 1: Uw adres
				</Link>
				<Typography underline="hover" color="inherit" to={`/results?postcode=${postcode}&houseNumber=${houseNumber}`}>
					Stap 2: Kies uw producten
				</Typography>
				<Typography underline="hover" color="inherit" to={`/questions?postcode=${postcode}&houseNumber=${houseNumber}&selectedItems=${JSON.stringify(selectedItems)}`}>
					<b>Stap 3: Vragen </b>
				</Typography>
			</Breadcrumbs>
			<div className="questions-form">
				<h1>Questions</h1>
				<form onSubmit={handleFormSubmit}>
					{questions.map((question) => (
						<div key={question.id} className="form-question">
							<p>{question.text}</p>
							{question.answers.map((answer) => (
								<label key={answer} className="form-answer">
									<input
										type="radio"
										value={answer}
										name={`question-${question.id}`}
										onChange={() => handleAnswerSelect(question.id, answer)}
									/>
									{answer}
								</label>
							))}
							{question.formFields.fieldsVisible && (
								<div>
									{question.id === 3 && <p>{question.formFields.infoText}</p>}
									{question.id === 3 && (
										<textarea
											className="expandable-text-field"
											value={question.formFields.expandableTextField}
											onChange={(e) =>
												setQuestions((prevQuestions) =>
													prevQuestions.map((q) =>
														q.id === question.id
															? {
																...q,
																formFields: {
																	...q.formFields,
																	expandableTextField: e.target.value,
																},
															}
															: q
													)
												)
											}
										/>
									)}
									{question.id === 1 && (
										<div>
											<input
												type="text"
												placeholder="Soort verzekering"
												className="input-field"
												value={question.formFields.soortVerzekering}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		soortVerzekering: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Maatschappij"
												className="input-field"
												value={question.formFields.maatschappij}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		maatschappij: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Polisnummer"
												className="input-field"
												value={question.formFields.polisnummer}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		polisnummer: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Soort dekking"
												className="input-field"
												value={question.formFields.soortDekking}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		soortDekking: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Verzekerd bedrag"
												className="input-field"
												value={question.formFields.verzekerdBedrag}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		verzekerdBedrag: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="date"
												placeholder="Einddatum"
												className="input-field"
												value={question.formFields.einddatum}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		einddatum: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<p>
												Eventuele opzegging van elders lopende verzekeringen wordt verzorgd door:
											</p>
											<input
												type="text"
												placeholder="Eventuele Opzegging"
												className="input-field"
												value={question.formFields.eventueleOpzegging}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		eventueleOpzegging: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<label>
												<input
													type="checkbox"
													className="input-field"
													checked={question.formFields.uzelf}
													onChange={(e) =>
														setQuestions((prevQuestions) =>
															prevQuestions.map((q) =>
																q.id === question.id
																	? {
																		...q,
																		formFields: {
																			...q.formFields,
																			uzelf: e.target.checked,
																			intermediair: false,
																		},
																	}
																	: q
															)
														)
													}
												/>
												Uzelf (verzekeringnemer)
											</label>
											<label>
												<input
													type="checkbox"
													className="input-field"
													checked={question.formFields.intermediair}
													onChange={(e) =>
														setQuestions((prevQuestions) =>
															prevQuestions.map((q) =>
																q.id === question.id
																	? {
																		...q,
																		formFields: {
																			...q.formFields,
																			intermediair: e.target.checked,
																			uzelf: false,
																		},
																	}
																	: q
															)
														)
													}
												/>
												Intermediair
											</label>
										</div>
									)}
									{question.id === 2 && (
										<div>
											<input
												type="number"
												placeholder="Aantal schades"
												className="input-field"
												value={question.formFields.aantalSchades}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		aantalSchades: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="date"
												placeholder="Wanneer was de laatste schade?"
												className="input-field"
												value={question.formFields.laatsteSchadeDatum}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		laatsteSchadeDatum: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="number"
												placeholder="Totaal bedrag van de (alle) schade(s)"
												className="input-field"
												value={question.formFields.totaalSchadeBedrag}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		totaalSchadeBedrag: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
										</div>
									)}
									{question.id === 4 && (
										<div>
											<input
												type="text"
												placeholder="Maatschappij"
												className="input-field"
												value={question.formFields.maatschappij}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		maatschappij: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Polisnummer"
												className="input-field"
												value={question.formFields.polisnummer}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		polisnummer: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Toelichting"
												className="input-field"
												value={question.formFields.toelichting}
												onChange={(e) =>
													setQuestions((prevQuestions) =>
														prevQuestions.map((q) =>
															q.id === question.id
																? {
																	...q,
																	formFields: {
																		...q.formFields,
																		toelichting: e.target.value,
																	},
																}
																: q
														)
													)
												}
											/>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</form>
			</div>
			<Button variant="contained" color="primary" size="large" onClick={handleFormSubmit}>
				Aanvragen
			</Button>
			<ToastContainer />
		</div>
	);
}

export default Questions;
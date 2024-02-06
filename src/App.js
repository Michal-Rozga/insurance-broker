import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './FormPage';
import ResultsPage from './ResultsPage';
import Questions from "./Questions";
import './styles.css';
import Navigation from "./Navigation";

function App() {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path="/" element={<FormPage />} />
				<Route path="/results" element={<ResultsPage />} />
				<Route path="/questions" element={<Questions />} />
			</Routes>
		</Router>
	);
}

export default App;
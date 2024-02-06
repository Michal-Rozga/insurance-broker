import React from 'react';

const Table = ({ product, selectedItems, onCheckboxChange }) => {
	const handleCheckboxChange = (propertyName) => {
		onCheckboxChange(propertyName);
	};

	return (
		<div className="table-style">
			<table className="table-container">
				<thead className="table-container">
					<tr>
						<th>Kies je verzekeringsproduct</th>
						<th>Premie per maand</th>
					</tr>
				</thead>
				<tbody>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumAvp}
								onChange={() => handleCheckboxChange('PremiumAvp')}
							/>
							Aansprakelijkheidsverzekering
						</label>
					</td>
					<td>€ {product.PremiumAvp}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumBuiten}
								onChange={() => handleCheckboxChange('PremiumBuiten')}
							/>
							Buitenshuisverzekering
						</label>
					</td>
					<td>€ {product.PremiumBuiten}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumInboedel}
								onChange={() => handleCheckboxChange('PremiumInboedel')}
							/>
							Inboedelverzekering
						</label>
					</td>
					<td>€ {product.PremiumInboedel}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumOngevallen}
								onChange={() => handleCheckboxChange('PremiumOngevallen')}
							/>
							Ongevallenverzekering
						</label>
					</td>
					<td>€ {product.PremiumOngevallen}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumRechtsbijstand}
								onChange={() => handleCheckboxChange('PremiumRechtsbijstand')}
							/>
							Rechtsbijstandverzekering
						</label>
					</td>
					<td>€ {product.PremiumRechtsbijstand}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumReis}
								onChange={() => handleCheckboxChange('PremiumReis')}
							/>
							Reisverzekering
						</label>
					</td>
					<td>€ {product.PremiumReis}</td>
				</tr>
				<tr>
					<td>
						<label>
							<input
								type="checkbox"
								checked={selectedItems.PremiumWoonhuis}
								onChange={() => handleCheckboxChange('PremiumWoonhuis')}
							/>
							Woonhuisverzekering
						</label>
					</td>
					<td>€ {product.PremiumWoonhuis}</td>
				</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Table;
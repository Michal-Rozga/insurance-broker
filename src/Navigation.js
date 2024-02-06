import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import imgSrc from './pictures/Artboard-1-e1701426225537.png';

function Navigation() {
	return (
		<nav className="navigation">
			<div className="navigation-logo">
				<Link to="https://zelfzeker.online/" >
					<img src={imgSrc} alt={'Zelfzeker-logo'}/>
				</Link>
			</div>
			<div className="navigation-links">
				<ul>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online/" >Home</Link>
					</li>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online/index.php/producten/" >Verzekeringen</Link>
					</li>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online/index.php/diensten/" >Veelgestelde vragen</Link>
					</li>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online/index.php/login/" >Login</Link>
					</li>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online/index.php/schademelding/" >Schademelden</Link>
					</li>
					<li>
						<Link style={{fontSize: '1rem'}} to="https://zelfzeker.online:3001/" >Check uw voordeel</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navigation;

/*
Add the items to the navigation menu and make the navigation bar smaller.

Adjust the pic accord..

add the text under the postal code input field, in the middle of the screen
approx the same as the placement of the postal code input field. (centered below the current 3)
 */
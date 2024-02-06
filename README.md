# Insurance Quote Application - Proof of Concept

## Overview

This repository contains a Proof of Concept (POC) for an Insurance Quote Application. The application is designed to collect user input regarding insurance preferences, process the data, and provide a quote based on the selected options.

## Disclaimer

This application is a Proof of Concept (POC) and is not intended for production use.
It is designed to demonstrate the functionality of an Insurance Quote Application and is not a complete solution.
However, the application can be further developed and expanded to meet the requirements of a production environment.
Currently, the application is only available in Dutch and is designed for Dutch postal codes.
Https is implemented in the application, but it is not fully functional due to the lack of a valid SSL certificate.

- The API used in this project has access restrictions and is subject to specific terms of service set by the API provider.
- Users of this project should obtain their own API access from the provider and adhere to the associated terms and conditions.
- The project maintainer is not responsible for any misuse or violation of the API provider's terms.

## Features

- **Dynamic Questionnaire:** Users are presented with a dynamic questionnaire that adapts based on their responses.

- **Insurance Selection:** Users can choose from various insurance products, including AVP, Buiten, Inboedel, Ongevallen, Reis, Rechtsbijstand, and Woonhuis.

- **Data Storage:** The application saves user responses and selected insurance products in a backend database.

- **Notification:** Upon successful data submission, users are notified with a pop-up message indicating that the data has been saved.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MariaDB

## Installation

1. Clone the repository to your local machine.
2. Navigate to the `main` directory and run `npm install` to install the required dependencies.
3. Navigate to the `backend` directory and run `npm install` to install the required dependencies.
4. Create a `.env` file in the `backend` directory and add the following environment variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=insurance
```

Replace `localhost`, `root`, `password`, and `insurance` with your MariaDB host, username, password, and database name, respectively.
Make sure to create the `insurance` database in MariaDB before running the application.
In addition, replace the https://my-domain.com with your domain in the server.js file in the backend directory
as well as in the axiosConfig.js file in the frontend directory.

5. Run `npm start` in the `main` directory to start the frontend application.
6. Run `npm start` in the `backend` directory to start the backend server.
7. Navigate to `http://localhost:3000` in your web browser to access the application.

## Usage

1. Input an existing postal code (need to be a Dutch postal code) and click "Submit" to proceed.
2. Select the insurance products you are interested in and click "Next" to proceed.
3. Answer the questions presented to you and click "Next" to proceed. The questionnaire will adapt based on your responses.
4. Review your selected responses and click "Submit" to save your data.
5. A pop-up message will appear to notify you that your data has been saved.
6. To view the saved data, access the `insurance` database in MariaDB.

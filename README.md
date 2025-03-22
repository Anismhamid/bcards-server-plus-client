<h1 align="center">Guide for User Authentication and Business Cards Management API</h1>

This README is specifically designed to understand how to implement the API, set up different development and production environments, and run the necessary tests to ensure the functionality of the **User Authentication and Business Cards Management API**.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Testing Tools](#testing-tools)
4. [Running Tests](#running-tests)
5. [Test Cases](#test-cases)
6. [Test Data](#test-data)
7. [Error Handling](#error-handling)
8. [Reporting Issues](#reporting-issues)

## Overview

This API handles **user authentication**, **card management**, and provides **admin functionalities**. The following features are implemented:

-   User registration
-   User login (JWT Authentication)
-   Card creation, Read, updates, and deletions
-   Liking/unliking cards
-   Admin functionalities to manage users

# Project Setup and Running Instructions

Ensure you have the following prerequisites installed::

-   **Node.js** (v20.18.x or higher): [Download Node.js](https://nodejs.org/)
-   **npm**: Node Package Manager (automatically installed with Node.js)
-   **MongoDB And Create Database**: If using a local database, install MongoDB Compass And Create Database with the name `bcards` (or use MongoDB Atlas On port 8001).
-   **Postman/Insomnia**: For API testing, download
    -   [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download).

1. **Clone the Repository and setup the project**:

    - Open your terminal and run the following commands:

        ```bash
        git clone https://github.com/Anismhamid/bcards-server-plus-client.git
        ```

    - Navigate to the project directory and run, If nedded:
        ```bash
        cd bcards-server-plus-client
        ```
    - Install the dependencies for both ( client ) - ( server ) from the root directory ( bcards-server-plus-client ):
        ```bash
        npm install
        ```

2. **Run the Project**:

    - **In Development Mode**:

        ```bash
        npm run start:dev
        ```

    - **In Production Mode**:
        ```bash
        npm run start:prod
        ```

## Running Client and Server Independently

-   **Production mode**

1. **Start the ( Server ) in Production Mode**:

    - Open a terminal window and run

        ```bash
        npm run start:server
        ```

2. **Start the ( Client ) in Production Mode**:

    - Open new terminal window and run

        ```bash
        npm run start:client
        ```

---

1. **Start the ( Server ) in Development Mode:**:

    - Open a terminal window and run

        ```bash
            npm run dev:server
        ```

1. **Start the ( Client ) in Development Mode:**:

    - Open a New terminal window and run

        ```bash
        npm run dev:client
        ```

---

### Manual Testing

You can manually test the API by sending HTTP requests using Postman or any similar tool. Here's how you can interact with your endpoints:

---

### Users

1. **User Registration**:

    - **Method**: `POST`
    - **Development Mode URL**: `http://localhost:8000/api/users`
    - **Productin Mode URL**: `http://localhost:8001/api/users`
    - **Body (JSON)**:
        ```json
        {
        	"name": {
        		"first": "John",
        		"middle": "", // Middle name is Optional
        		"last": "Smith"
        	},
        	"email": "john.doe@example.com",
        	"phone": "0501234567",
        	"password": "Password123!",
        	"image": {
        		// Image is optional
        		"url": "http://your_picture_path/picture.jpg",
        		"alt": "picture name"
        	},
        	"isBusiness": true,
        	"isAdmin": true, // it's false by default, but for your convenienc you are admin for editig stuff
        	"address": {
        		"state": "", // State is Optional
        		"country": "Israel",
        		"city": "Tel Aviv",
        		"street": "Dizengoff",
        		"houseNumber": 123,
        		"zip": 12345
        	}
        }
        ```

2. **User Login**:

    - **Method**: `POST`
    - **Development Mode URL**: `http://localhost:8000/api/users/login`
    - **Productin Mode URL**: `http://localhost:8001/api/users/login`
    - **Body (JSON)**:
        ```json
        {
        	"email": "john.doe@example.com",
        	"password": "Password123!"
        }
        ```

<!-- 3. **Protected Route Access (e.g., User Profile)**:

    - **Method**: `GET`
    - **URL**: `http://localhost:8000/api/users`
    - **Headers**:
        - Authorization: `{AdminToken}` (Use the JWT from the login response)

4. **Admin Routes**:

    - **Method**: `GET`
    - **URL**: `http://localhost:8000/api/admin/users`
    - **Headers**:
        - Authorization: `{adminToken}` -->

---

### Cards

1. **Post New Card**:

    - **Method**: `POST`
    - **Development Mode URL**: `http://localhost:8000/api/cards`
    - **Productin Mode URL**: `http://localhost:8001/api/cards`
    - **Response**: `200 OK` (Returns the card)
    - **Body (JSON)**:
        ```json
        {
        	"title": "Updated Business Card Title",
        	"subtitle": "Updated Subtitle",
        	"description": "Updated description of the business card",
        	"phone": "0509876543",
        	"email": "updated.business.email@example.com",
        	"web": "https://www.updatedwebsite.com",
        	"image": {
        		"url": "http://new_picture_path/business-card-updated.jpg",
        		"alt": "updated business card image"
        	},
        	"address": {
        		"country": "Israel",
        		"city": "Tel Aviv",
        		"street": "New Street",
        		"houseNumber": 456,
        		"zip": "65432"
        	}
        }
        ```

2. **Get All Cards (Global)**:

    - **Method**: `GET`
    - **Development Mode URL**: `http://localhost:8000/api/cards`
    - **Productin Mode URL**: `http://localhost:8001/api/cards`
    - **Response**:
        - **200 OK**: Returns the card.
        - **400 Bad Request**: No cards found.

3. **Get Favorite Cards for Specific User**:

    - **Method**: `GET`
    - **Development Mode URL**: `http://localhost:8000/api/cards/my-cards`
    - **Productin Mode URL**: `http://localhost:8001/api/cards/my-cards`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns all cards related to the logged-in user.
        - **401 Unauthorized**: User must be logged in.
        - **404 Not Found**: No cards found for the user.

4. **Get Card by ID**:

    - **Method**: `GET`
    - **Development Mode URL**: `http://localhost:8000/api/cards/{cardId}`
    - **Productin Mode URL**: `http://localhost:8001/api/cards/{cardId}`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns the card details.
        - **404 Not Found**: Card not found.

5. **Update Card by ID**:

    - **Method**: `PUT`
    - **URL**:
    - **Development Mode URL**: `http://localhost:8000/api/cards/{cardId}`
    - **Productin Mode URL**: `http://localhost:8001/api/cards/{cardId}`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:

        - **200 OK**: Returns the card details.
        - **400 Bad Request**: Invalid request body.
        - **401 Unauthorized**: User must be the card owner or an admin to update the card.
        - **404 Not Found**: Card not found.

    - **Body (JSON)**:
        ```json
        {
        	"title": "Updated Business Card Title",
        	"subtitle": "Updated Subtitle",
        	"description": "Updated description of the business card",
        	"phone": "0509876543",
        	"email": "updated.business.email@example.com",
        	"web": "https://www.updatedwebsite.com", // optional
        	"image": {
        		"url": "http://new_picture_path/business-card-updated.jpg",
        		"alt": "updated business card image"
        	},
        	"address": {
        		"state": "", // optional
        		"country": "Israel",
        		"city": "Tel Aviv",
        		"street": "New Street",
        		"houseNumber": 456,
        		"zip": "65432"
        	}
        }
        ```

6. **Like/Unlike Card**:

    - **Method**: `PATCH`
    - **Development Mode URL**: `http://localhost:8000/api/cards/{cardId}`
    - **Productin Mode URL**: `http://localhost:8001/api/cards/{cardId}`
    - **Body**: Empty
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns the card details.
        - **401 Unauthorized**: User must be logged in.

7. **Delete Card**:

    - **Method**: `Delete`
    - **Development Mode URL**:`http://localhost:8000/api/cards/{cardId}`
    - **Productin Mode URL**: `http://localhost:8001/api/cards/{cardId}`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for owner user or admin user)
    - **Response**:
        - **200 OK**: Successfully deletes the card.
        - **403 Forbidden**: User must be the card owner or an admin to delete the card.
        - **404 Not Found**: Card not found.

---

### Automated Testing

If you want to automate your tests, you can use **Mocha** and **Chai** for API testing in Node.js.

1. **Install testing dependencies**:

    ```bash
    npm install --save-dev mocha chai chai-http
    ```

2. **Create a test file** (e.g., `test/user.test.js`) and write your test cases.

---

## Test Cases

Here are the basic test cases to verify the functionality of the API:

1. **Test Case: User Registration**

    - **Test Steps**:
        - Send a `POST` request to the `api/users` endpoint with valid data.
        - Verify that the user is successfully registered (status code `200`).
    - **Expected Result**: The user should be registered successfully, and a success message should be returned.

2. **Test Case: User Login**

    - **Test Steps**:
        - Send a `POST` request to the `api/users/login` endpoint with valid credentials.
        - Verify that a JWT token is returned (status code `200`).
    - **Expected Result**: A valid JWT token should be returned.

<!-- 3. **Test Case: JWT Authentication**

    - **Test Steps**:
        - Send a `GET` request to a protected route (e.g., `/profile`) with a valid token in the `Authorization` header.
        - Verify that the response contains the user data.
    - **Expected Result**: The response should include the user data, and the status code should be `200`. -->

<!-- 4. **Test Case: Admin Route Access**

    - **Test Steps**:
        - Send a `GET` request to the `/admin/users` endpoint with a valid admin token in the `Authorization` header.
        - Verify that all users are returned.
    - **Expected Result**: The list of users should be returned with the status code `200`. -->

---

## Test Data

For testing, you can use sample data like the following:

-   **Valid User**:

    -   `email`: "test@example.com"
    -   `password`: "Password123!"
    -   `name`: "John Doe"
    -   `phone`: "0501234567"
    -   `address`: { country: "Israel", city: "Tel Aviv", street: "Dizengoff", houseNumber: 123, zip: 12345 }

-   **Invalid User** (for error cases):
    -   `email`: "invalid-email"
    -   `password`: "abc123" (too weak)

---

## Error Handling

Make sure to handle errors properly. Here are some scenarios to consider:

-   **Missing Required Fields**: Ensure that the API responds with appropriate error messages when required fields are missing.
-   **Invalid Email Format**: The API should reject any invalid email format.
-   **Incorrect Password**: Ensure that the login returns an error when the password is incorrect.
-   **JWT Expiry**: Make sure that expired tokens result in an appropriate error message.

---

## Reporting Issues

If you encounter any issues while using the API, please follow the steps below to ensure that the issue is properly reported and can be addressed quickly:

### 1. **Labeling the Issue**

When submitting an issue, please label it according to the type of problem you are experiencing. Some common labels include:

-   **Bug**: For any unexpected behavior or functionality errors.
-   **Enhancement**: For suggestions on how to improve the system or add new features.
-   **Question**: For general inquiries or clarifications on how the API works.
-   **Security**: For any security vulnerabilities or concerns.
-   **Performance**: For issues related to slow or unresponsive functionality.

### 2. **Create a Detailed Description**

Provide a detailed description of the problem you encountered, including:

-   **Title**: A brief summary of the issue.
-   **Steps to Reproduce**: List the exact steps to reproduce the issue.

    Example:

    1. Navigate to the login page.
    2. Enter an invalid email address.
    3. Submit the form.

-   **Expected Behavior**: Describe what should happen if the system works correctly.
-   **Actual Behavior**: Describe what happens when the issue occurs.

### 3. **Provide Error Messages and HTTP Status Codes**

If the issue involves an error, please include:

-   **Error Messages**: Copy any relevant error messages you encounter.
-   **HTTP Status Codes**: Provide any HTTP status codes returned by the server (e.g., 404, 500, etc.).
-   **Relevant Data**: Include any request or response data that might help identify the issue.

Example:

```json
{
	"error": "Invalid email format",
	"status": 400
}
```

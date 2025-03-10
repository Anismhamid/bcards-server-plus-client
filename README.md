# Tester Guide for User Authentication and Management API

This README is specifically for testers to understand how to test the API, set up the test environment, and run the necessary tests for ensuring the functionality of the **User Authentication and Management API**.

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
-   Card creation, updates, and deletions
-   Liking/unliking cards
-   Admin functionalities to manage users

As a tester, you are responsible for validating the functionality of these features through API tests. You will need to verify that the endpoints work as expected, handle edge cases, and provide appropriate error messages when necessary.

## Setup

Before you begin testing, follow these steps to set up the project:

1. **Clone the Repository**:
   Open your terminal and run the following commands:

    ```bash
    git clone https://github.com/Anismhamid/bcards-server-plus-client.git
    cd anis-mhamid-react-app-1
    npm install
    npm run dev
    ```

2. **Open a New Terminal**:
   In a new terminal window, run the following commands to set up the server:

    ```bash
    cd bcards-server
    npm install
    npm install --save-dev nodemon
    nodemon
    ```

---

## Testing Tools

To ensure effective testing, you can use the following tools:

-   **Postman**: A popular tool for testing APIs by sending HTTP requests.

    -   [Download Postman](https://www.postman.com/downloads/)

-   **Insomnia**: An alternative to Postman for API testing.

    -   [Download Insomnia](https://insomnia.rest/download)

-   **curl**: A command-line tool for testing APIs.

---

## Running Tests

### Manual Testing

You can manually test the API by sending HTTP requests using Postman or any similar tool. Here's how you can interact with your endpoints:

---

### Users

1. **User Registration**:

    - **Method**: `POST`

    - **URL**: `http://localhost:8000/api/register`

    - **Body (JSON)**:
        ```json
        {
        	"name": {
        		"first": "John",
        		"middle": "Doe",
        		"last": "Smith"
        	},
        	"email": "john.doe@example.com",
        	"phone": "0501234567",
        	"password": "Password123!",
        	"image": {
        		"url": "http://your_picture_path/picture.jpg",
        		"alt": "picture name"
        	},
        	"isBusiness": false,
        	"address": {
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

    - **URL**: `http://localhost:8000/api/login`

    - **Body (JSON)**:
        ```json
        {
        	"email": "john.doe@example.com",
        	"password": "Password123!"
        }
        ```

3. **Protected Route Access (e.g., User Profile)**:

    - **Method**: `GET`

    - **URL**: `http://localhost:8000/api/users`

    - **Headers**:
        - Authorization: `{AdminToken}` (Use the JWT from the login response)

4. **Admin Routes**:

    - **Method**: `GET`

    - **URL**: `http://localhost:8000/api/admin/users`

    - **Headers**:
        - Authorization: `{adminToken}`

---

### Cards

1. **Post New Card**:

    - **Method**: `POST`
    - **URL**: `http://localhost:8000/api/cards`
    - **Response**: `200 OK` (Returns the card).
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
    - **URL**: `http://localhost:8000/api/cards`
    - **Response**:
        - **200 OK**: Returns the card.
        - **400 Bad Request**: No cards found.

3. **Get Favorite Cards for Specific User**:

    - **Method**: `GET`
    - **URL**: `http://localhost:8000/api/cards/my-cards`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns all cards related to the logged-in user.
        - **401 Unauthorized**: User must be logged in.
        - **404 Not Found**: No cards found for the user.

4. **Get Card by ID**:

    - **Method**: `GET`
    - **URL**: `http://localhost:8000/api/cards/my-cards`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns the card details.
        - **404 Not Found**: Card not found.

5. **Update Card by ID**:

    - **Method**: `PUT`
    - **URL**: `http://localhost:8000/api/cards/{cardId}`
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

6. **Like/Unlike Card**:

    - **Method**: `PATCH`
    - **URL**: `http://localhost:8000/api/cards/like/{cardId}/{userId}`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for logged-in user)
    - **Response**:
        - **200 OK**: Returns the card details.
        - **401 Unauthorized**: User must be logged in.

7. **Delete Card**:

    - **Method**: `Delete`
    - **URL**: `http://localhost:8000/api/cards/{id}`
    - **Headers**:
        - Authorization: `{UserToken}` (JWT token for user)
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
        - Send a `POST` request to the `/register` endpoint with valid data.
        - Verify that the user is successfully registered (status code `200`).
    - **Expected Result**: The user should be registered successfully, and a success message should be returned.

2. **Test Case: User Login**

    - **Test Steps**:
        - Send a `POST` request to the `/login` endpoint with valid credentials.
        - Verify that a JWT token is returned (status code `200`).
    - **Expected Result**: A valid JWT token should be returned.

3. **Test Case: JWT Authentication**

    - **Test Steps**:
        - Send a `GET` request to a protected route (e.g., `/profile`) with a valid token in the `Authorization` header.
        - Verify that the response contains the user data.
    - **Expected Result**: The response should include the user data, and the status code should be `200`.

4. **Test Case: Admin Route Access**
    - **Test Steps**:
        - Send a `GET` request to the `/admin/users` endpoint with a valid admin token in the `Authorization` header.
        - Verify that all users are returned.
    - **Expected Result**: The list of users should be returned with the status code `200`.

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
    -   `password`: "123" (too weak)

---

## Error Handling

Make sure to handle errors properly. Here are some scenarios to consider:

-   **Missing Required Fields**: Ensure that the API responds with appropriate error messages when required fields are missing.
-   **Invalid Email Format**: The API should reject any invalid email format.
-   **Incorrect Password**: Ensure that the login returns an error when the password is incorrect.
-   **JWT Expiry**: Make sure that expired tokens result in an appropriate error message.

---

## Reporting Issues

If you encounter any issues, please report them as follows:

1. Create a detailed description of the problem, including the steps to reproduce it.
2. Include any error messages, HTTP status codes, and relevant data.
3. Attach screenshots or logs if needed.

---

effectively verify the functionality of the **User Authentication and Management API**.

# Vidly

A simple and lightweight RESTful API built with Node.js and Express for managing movie genres.

## Features

- Complete CRUD (Create, Read, Update, Delete) operations for movie genres.
- Input validation for creation and update requests.
- Environment variable configuration support for secure and flexible deployment.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository or download the source code to your local machine.

2. Navigate to the project directory:
   ```bash
   cd vidly
   ```

3. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory of the project and define the required variables:

```env
# Example .env file
PORT=3000
```
> **Note:** The server relies on the `PORT` environment variable to run. If not set, it may fail to start.

## Usage

### Development Mode

To start the server with hot-reloading using `nodemon`:

```bash
npm run dev
```

### Standard Execution

Alternatively, to run the server conventionally:

```bash
node index.js
```

The console will output the port the application is listening on (e.g., `App listening on port 3000`).

## API Reference

### Genres API

Base URL for genres: `/api/genres`

#### GET `/api/genres`
Retrieves a list of all available movie genres.

#### GET `/api/genres/:id`
Retrieves the details of a specific genre by its integer `id`.
- **Responses:**
  - `200 OK`: Returns the genre object.
  - `400 Bad Request`: If the genre with the specified ID is not found.

#### POST `/api/genres`
Creates a new genre.
- **Request Body:**
  ```json
  {
    "name": "Action"
  }
  ```
  *(The `name` field is required and must be strictly greater than 3 characters in length.)*
- **Responses:**
  - `200 OK`: Returns the updated list of genres including the newly created one.
  - `400 Bad Request`: If the validation fails (e.g., missing name or name is too short).

#### PUT `/api/genres/:id`
Updates an existing genre identified by its `id`.
- **Request Body:**
  ```json
  {
    "name": "Thriller"
  }
  ```
  *(The `name` field is required and must be strictly greater than 3 characters in length.)*
- **Responses:**
  - `200 OK`: Returns the updated list of genres.
  - `400 Bad Request`: If the genre is not found or if the request body validation fails.

#### DELETE `/api/genres/:id`
Deletes an existing genre by its `id`.
- **Responses:**
  - `200 OK`: Returns the updated list of remaining genres.
  - `404 Not Found`: If the genre with the specified ID does not exist.

## Technologies Used

- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment.
- **[Express](https://expressjs.com/)** - Fast, unopinionated, minimalist web framework for testing and building APIs.
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **[nodemon](https://nodemon.io/)** - Utility that automatically restarts the Node.js application when file changes in the directory are detected.

## License

This project is licensed under the ISC License. See the `package.json` file for details.

# Bill Generator API

NodeJS (Express) based Backend API server for the Bill-generator app, this is a REST API to create, fetch, update, delete & generate PDFs for bills. Server calculate selling prices and total amount based on input quantity & price of product while bill creation and save it to database.

- [List of Routes](#routes)
- [Installation & Setup](#installation-&-setup)
- [Start Server](#Running-the-Project-and-Start-Express-server)

## Base URL

API routes below are mounted under `/api/v1/bill` in the project

> Base localhost endpoint: http://localhost:4000/api/v1/bill

## Routes

1. POST `/api/v1/bill/create`

   - Create a new bill. Server validates inputs, calculate selling prices and total amount based on quantity and price, then saves to database.
     ```powershell
     'http://localhost:4000/api/v1/bill/create'
     ```
   - Required body fields:
     - `customerName` (string)
     - `items` (array of item objects)
   
   - Request body JSON example [CLICK HERE](#Request-body-for-creating-or-updating-bill)

2. GET `/api/v1/bill/all`

   - Fetch paginated list of bills with sorting.
     ```powershell
     'http://localhost:4000/api/v1/bill/all'
     ```
   - Query parameters (optional):
     - `limit` (number) — items per page (default 10)
     - `page` (number) — page number for pagination (default 1)
     - `sort` (string) — `default` (sort by newest date), `higestamount` (sort by highest totalAmount), `lowestamount` (sort by lowest totalAmount)
   
   - Example with pagination and sorting with limit query parameter:
     ```powershell
     'http://localhost:4000/api/v1/bill/all?limit=5&page=1&sort=higestamount'
     ```

4. GET `/api/v1/bill/:id`

   - Fetch a single bill by its MongoDB ObjectId.
     ```powershell
     'http://localhost:4000/api/v1/bill/:id'
     ```
   - Example:
     ```powershell
     'http://localhost:4000/api/v1/bill/614c0f2e8a3a2b0012345678'
     ```

5. DELETE `/api/v1/bill/delete/:id`

   - Delete a bill by MongoDB ObjectId.
     ```powershell
     'http://localhost:4000/api/v1/bill/delete/:id'
     ```
   - Example:
     ```powershell
     'http://localhost:4000/api/v1/bill/delete/614c0f2e8a3a2b0012345678' 
     ```

6. PUT `/api/v1/bill/update/:id`

   - Update an existing bill (customerName & items). Input is validated and totals recalculated.
     ```powershell
     'http://localhost:4000/api/v1/bill/update/:id'
     ```
   - Example:
     ```powershell
     'http://localhost:4000/api/v1/bill/update/614c0f2e8a3a2b0012345678'
     ```
   - Request body JSON example [CLICK HERE](#Request-body-for-creating-or-updating-bill)
    
7. GET `/api/v1/bill/generate-pdf/:id`
   
   - Generate a PDF for the bill (returns `application/pdf`).
     ```powershell
     'http://localhost:4000/api/v1/bill/generate-pdf/:id'
     ```
   - Example :
     ```powershell    
     'http://localhost:4000/api/v1/bill/generate-pdf/614c0f2e8a3a2b0012345678'
     ```
### Request body for creating or updating bill
```json
{
	"customerName": "Atanu Pal",
	"items": [
		{
			"name": "Kitkat",
			"quantity": "2",
			"discount": "5",
			"price": "80"
		},
		{
			"name": "Cadbury Dairy milk",
			"quantity": "4",
			"discount": "5",
			"price": "20"
		}
	]
}
```
## Installation & Setup

### Prerequisites
- Node.js (v14.x or above)
- npm (v6.x or above)
- MongoDB (v4.x or above)

### Node.js Installation
1. Download the Node.js installer from the [official website](https://nodejs.org/).
2. Run the installer and follow the instructions.
3. Verify the installation by running the following commands in your terminal:
    ```bash
    node -v
    npm -v
    ```
4. Download and install MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community).
5. Download and install Compass (MongoDB GUI) from [official website](https://www.mongodb.com/try/download/compass).

### Clone the Repository
1. Download and install GIT from [official website](https://git-scm.com/downloads/win).
2. Open your terminal.
3. Clone the repository using the following command:
    ```bash
    git clone https://github.com/Atanu-P/bill-generator.git
    ```
4. Navigate to the backend folder inside project directory to install required dependencies:
    ```bash
    cd bill-generator && cd backend
    ```
5. Install the required Node.js dependencies, all the dependencies listed in `package.json` file within backend folder:
    ```bash
    npm install
    ```

### Running the Project and Start Express server
1. Start the server using the following command:
    ```bash
    cd backend && npm start
    ```
2. The server should now be running on `http://localhost:4000`.

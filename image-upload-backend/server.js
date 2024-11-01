// Import required packages and modules
const express = require('express');
const cors = require('cors');

// Initialize the Express application
const app = express();
const port = process.env.PORT || 5000; // Set port from environment variable or default to 5000

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

const Routes = require('./Routes');
app.use('/', Routes);

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Log the server URL
});
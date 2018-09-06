// Requires
const fs = require('fs'); // File system module

// Load the html page into memory before the server starts
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

// Function to send index in the response
const getIndex = (request, response) => {
  // Send the index in the response
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Function to send page2 in the response
const getPage2 = (request, response) => {
  // Send page2 in the response
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page2);
  response.end();
};

// Function to send page3 in the response
const getPage3 = (request, response) => {
  // Send page3 in the response
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page3);
  response.end();
};

// Export the functions (make it public)
module.exports.getIndex = getIndex;
module.exports.getPage2 = getPage2;
module.exports.getPage3 = getPage3;

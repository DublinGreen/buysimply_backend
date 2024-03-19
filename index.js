const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');


const config = {
  port   : 55555,
  apiUrl : '/api/v1/'
}

let loansData = null;
let staffsData = null;

fs.readFile('./data/loans.json', (err, data) => {
    if (err) throw err;
    loansData = JSON.parse(data);
});

fs.readFile('./data/staffs.json', (err, data) => {
    if (err) throw err;
    staffsData = JSON.parse(data);
});

// App configurations
const app = express();
// Let the app be able to see the html file that called the server
app.use(bodyParser.urlencoded({ extended: true })); 

// A RESTFul GET API
app.get(`${config.apiUrl}loans`, (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    res.status(200).json({ 'status': 200 , 'data': loansData, 'message': 'All loans data'});
});

app.get(`${config.apiUrl}staffs`, (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    res.status(200).json({ 'status': 200 , 'data': staffsData, 'message': 'All staff data'});
});

app.post(`${config.apiUrl}login`, (req, res) => {
  res.send(req.params);
});

app.post(`${config.apiUrl}logout`, (req, res) => {
  res.send(req.params);
});


















// Another RESTFul GET API
app.get("/api/course", (req, res) => {
  res.send([1,2,3]);
});

// My parameters input RESTFul API
app.get("/test/:year/:month", (req, res) => {
  // http://localhost:55555/test/2020/5
  res.send(req.params);
});

// My parameters input POST RESTFul API
app.post("/test2/:year/:month", (req, res) => {
  // Same as the above one but with POST method
  res.send(req.params);
});

// Starting up the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
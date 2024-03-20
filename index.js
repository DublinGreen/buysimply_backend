const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const session = require('express-session');
const jwt = require("jsonwebtoken");

const config = {
  port   : 55555,
  apiUrl : '/api/v1/',
  successCode: 200,
  badRequestCode: 400,
  notFoundCode: 404,
  internalServerErrorCode: 500,
  jwtsecret: 'secretkeyappearshere'
}

const roles = [
  'superAdmin',
  'admin',
  'staff'
];

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
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret',  // a secret string used to sign the session ID cookie
  resave: false,  // don't save session if unmodified
  saveUninitialized: false  // don't create session until something stored
}))


app.get(`${config.apiUrl}accessResource`,
    (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        //Authorization: 'Bearer TOKEN'
        if (!token) {
            res.status(200)
                .json(
                    {
                        success: false,
                        message: "Error!Token was not provided."
                    }
                );
        }

        res.status(200).json(
            {
                success: true,
                data: {
                    token: token                }
            }
        );
    })

app.get(`${config.apiUrl}loans`, (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    res.status(config.successCode).json({ 'status': config.successCode , 'data': loansData, 'message': 'All loans data'});
});

app.get(`${config.apiUrl}staffs`, (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    res.status(config.successCode).json({ 'status': config.successCode , 'data': staffsData, 'message': 'All staff data'});
});

app.post(`${config.apiUrl}login`, (req, res) => {
  res.setHeader('Content-Type', 'application/json'); 
  const { email, password } = req.body;

  if(email === undefined){
    res.status(config.badRequestCode).json({ 'status': config.badRequestCode , 'data': [], 'message': 'Email is undefined'});
  }

  if(password === undefined){
    res.status(config.badRequestCode).json({ 'status': config.badRequestCode , 'data': [], 'message': 'Password is undefined'});
  }

  if(email !== undefined && password !== undefined){
    const filteredStaff = staffsData.filter( x => 
      x.email === email && 
      x.password === password
    );

    req.session.userObj = filteredStaff;

    let token;
    try {
        //Creating jwt token
        token = jwt.sign(
            {
                userId: filteredStaff.id,
                email: filteredStaff.email
            },
            config.jwtsecret,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error =
            new Error("Error! Something went wrong.");
        return next(error);
    }
        
    res.status(config.successCode).json({
      'status': config.successCode , 
      data: {
          userId: filteredStaff.id,
          email: filteredStaff.email,
          token: token,
      },
      'message': 'login successful'
  });
  }
});

app.post(`${config.apiUrl}logout`, (req, res) => {
  res.setHeader('Content-Type', 'application/json'); 
  const token = req.headers.authorization.split(' ')[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(200)
        .json(
            {
                success: false,
                message: "Error!Token was not provided."
            }
        );
  }

  if(req.session.userObj !== undefined){
    req.session.userObj = null;
    res.status(config.successCode).json({ 'status': config.successCode , 'data': [], 'message': 'logout successful'});
  }
});

app.post(`${config.apiUrl}users/:email/:password`, (req, res) => {
  console.log(req.params);
  res.send('Create a new user');
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
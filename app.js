const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const urlConnectDB = require('./config/database');

// connected DB Mongoose
mongoose.connect(urlConnectDB.url).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Failed to connect to MongoDB", err);
});

// middleware
app.use(bodyParser.json()); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// define routes api
const apiRoute = require('./routes/api');
app.use('/api', apiRoute);

module.exports = app;



    
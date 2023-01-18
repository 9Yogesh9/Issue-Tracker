require("dotenv").config();
const express = require("express");
const port = 8000;
const app = express();
const dataBase = require('./config/mongoose');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware =require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// Setting static files path
app.use(express.static('./assets'));

// Replaced the express.urlencoded with bodyParser as express shows it as deprecated
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Setting view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Redirecting all requests to router
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Couldn't start the server : ${err}`);
        return;
    }
    console.log(`Server is ready to serve at port : ${port}`);
})
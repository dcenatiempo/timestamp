'use strict'
const url = require('url');
const path = require('path');
const express = require('express');
const app = express();

function parsePath (req, res) {
  let unix = NaN;
  let query = req.params.date;
  
  if ( isNaN( parseInt(query) ) === false ) {
    unix = parseInt(query);
  }
  else if (isNaN( Date.parse(query)) === false) {
    unix = Date.parse(query);
  }
  else if (query.search(/\+/g) >= 0) {
    unix = Date.parse(query.split("+").join(" "));
  }

  if (isNaN(unix) === true ) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("Invalid Parameters");
  }
  else {
  res.json(unixToJson(unix));
  res.end();
  }
}

function unixToJson (unix) {
  const date = new Date(unix)
  const month = date.toLocaleString("en-us", { month: "long" })
  const year = date.toLocaleString("en-us", { year: "numeric" })
  const day = date.toLocaleString("en-us", { day: "numeric" })
  const json = {
    unix: unix,
    natural: month + " " + day + ", " + year
  }
  return json;
}

app.engine('html', require('ejs').renderFile);  // engine to render html
app.set( 'view engine', 'html');                // set html view engine
app.use( express.static( path.join( __dirname, 'public' ) ) ); // location of static resources (css, js, etc.)
app.set( 'views', path.join( __dirname, 'views' ) ); // location of html views

//renders home page
app.get('/', (req, res) => {
  res.render('index');
} );

app.get('/:date', parsePath);


app.listen(3000);

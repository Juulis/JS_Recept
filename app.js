// Require the express module
const express = require('express');
// Create a new web server
const app = express();
// Tell the web server to serve files
// from the www folder
app.use(express.static('www'));
// Important: Tell the web server to accept
// post and puts with a JSON body
app.use(express.json({
    extended: false
}));
// Start the web server on port 3000
app.listen(3000, () => console.log('Listening on port 3000'));

// Require the Routes class - that sets all 
// REST-like routes

let Nutrition = require('./www/js/nutrition.class');
let nutrition = new Nutrition();
let Routes = require('./www/js/routes');
new Routes(app,nutrition);

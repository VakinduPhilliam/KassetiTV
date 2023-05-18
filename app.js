//Import all required modules
const express = require('express');
const path = require('path');

// Initialize express app
const app = express();

// Import routers
const {indexPage, video, upload, autoupload, search, about} = require('./routes/router');

const port = 6300;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // parse form data client
app.use(express.static(path.join(__dirname, '/'))); // configure express to use public folder

// Routes for the app
app.get('/', indexPage); // Route for loading the front page.
app.get('/video', video); // Route for watching a video.
app.get('/upload', upload); // Route for watching a video.
app.post('/autoupload', autoupload); // Route for upoading a video.
app.get('/search', search); // Route for searching movie filming locations
app.get('/about', about); // Route for posting and processing 'new dig' data.

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


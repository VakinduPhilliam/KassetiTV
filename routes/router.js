const { readFileSync } = require("fs");
const fs = require('fs');
const { resolve } = require('path'); // Import path finder
var request = require('request');
const { Client, ID, Account} = require("appwrite"); // Import Appwrite NPM module
require("dotenv").config();  // Environment event handler

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // API Endpoint
    .setProject('645f349401c238199bb0'); // Appwrite project ID

// Create a new appwrite user
const account = new Account(client);

let dataroute = resolve('./routes/json/data.json');

// Get videos list
const videodata = readFileSync(
    dataroute,
    "utf-8"
    );

module.exports = {

    // Object function to load front page.
    indexPage: async (req, res) => {

    let search ="Jungle";

    try {

        let options = {
          'method': 'GET',
          'url': 'https://api.thetavideoapi.com/uploadhttps://api.thetavideoapi.com/video/srvacc_13276wt681aczeh0xys067gz1/list?page=1&number=100',
          'headers': {
            'x-tva-sa-id': 'srvacc_13276wt681aczeh0xys067gz1',
            'x-tva-sa-secret': '4ucqfwvzve8mnmxxz0rmzjb2dr2nyqmv'
        }
        };
        
        //let response = await request(options).promise();
        //let videos = JSON.stringify(JSON.parse(response.Body), null, 4);
        //console.log(videos);

        let json = JSON.parse(videodata);

        let moviesFound = json.body.videos;

        res.render('home.ejs', {
            title: " ",
            message: '',
            movies:moviesFound
        });
      
    } catch (error) {
          console.error(`Request failed: ${error}`);
    }

    },

    // Object function to watch a video
    video: (req, res) => {

        // Get video id
        var id = req.query.id;

        let json = JSON.parse(videodata);

        let movies = json.body.videos;

        let videoId;
        let videoName;
        let videoURL;
        let videoViews;

        movies.forEach(e => {
            if(e.id==id){
                videoId = e.id;
                videoName = e.file_name;
                videoURL = e.playback_uri;
                videoViews = e.views;
            } 
        });

        if(videoId && videoName && videoURL && videoViews){
        res.render('video.ejs', {
            title: " ",
            message: '',
            movieId: videoId,
            movieName: videoName,
            movieURL: videoURL,
            movieViews: videoViews
        }); 
        } else {
            res.redirect('/');
        }

    },

    // Object function to load login page
    login: (req, res) => {
        res.render('login.ejs', {
            title: " "
            ,message: ''
        });
    },

    // Object function to load signup page
    signup: (req, res) => {
        res.render('signup.ejs', {
            title: " "
            ,message: ''
        });
    },

    // Object function to load forgot page
    forgot: (req, res) => {
        res.render('forgot.ejs', {
            title: " "
            ,message: ''
        });
    },

    // Object function to login
    signin: (req, res) => {

      const {email, password} = req.body;

      const login = account.createEmailSession(
        `${email}`,
        `${password}`
      )
      
      // Get response after account created
      login.then((response) => {
    
        res.status(200).json({"login": 1})
      
      }, (error) => {
    
        res.status(200).json({"login": 0, "reason":`${error}`})
      
      });

    },

    // Object function to create account
    account: (req, res) => {

        const {email, password, name} = req.body;

        // Register new User
        let newaccount = account.create(
          ID.unique(),
          `${email}`,
          `${password}`,
          `${name}`
        )
        
        // Get response after account created
        newaccount.then((response) => {

          res.status(200).json({"created": 1})
        
        }, (error) => {

          res.status(200).json({"created": 0, "reason":`${error}`})
        
        });

    },

    // Object function to recover password
    recover: (req, res) => {

        const {email} = req.body;

        const forgot = account.createPasswordRecovery(
          `${email}`,
          'https://example.com'
        )

        // Get Response
        forgot.then((response) => {
      
          res.status(200).json({"forgot": 1})
      
        }, (error) => {
      
          res.status(200).json({"forgot": 0, "reason":`${error}`})
      
        });
      
    },

    // Object function to load upload page
    upload: (req, res) => {
        res.render('upload.ejs', {
            title: " "
            ,message: ''
        });
    },

    // Object function to upload a video 
    autoupload: (req, res) => {

        const {medianame, text} = req.body;

        console.log(0)

        // In case there's a file in the form
        if (req.files) {

        // Capture file from form data
        const uploadedFile = req.files.file;
            
        // Give file new name
        let file_name = uploadedFile.name;

        let videoname = ((Math.random())*9999999999)+'_'+((Math.random())*9999999999);

        let extRegex = /\.[0-9a-z]+(?:-[0-9a-z]+)*$/i
        let uploadExtension = file_name.match(extRegex)[0]

        file_name = videoname + uploadExtension;    // Give file new name

        console.log(1)

        // Identify video file extension
        if ((uploadedFile.mimetype === 'video/mp4' || uploadedFile.mimetype === 'video/mov' || uploadedFile.mimetype === 'video/f4v' || uploadedFile.mimetype === 'video/m4b' || uploadedFile.mimetype === 'video/webm' || uploadedFile.mimetype === 'video/ogg' || uploadedFile.mimetype === 'video/mpeg' || uploadedFile.mimetype === 'video/mp2t') && uploadedFile.size < 48000000) {

        console.log(2)

        var optionsURL = {
            'method': 'POST',
            'url': 'https://api.thetavideoapi.com/upload',
            'headers': {
              'x-tva-sa-id': 'srvacc_13276wt681aczeh0xys067gz1',
              'x-tva-sa-secret': '4ucqfwvzve8mnmxxz0rmzjb2dr2nyqmv'
            }
        };
        
        request(optionsURL, function (errorURL, responseURL) {
          
            if (errorURL) {

                console.log(errorURL)
              res.status(200).json({"upload": 0})
            } else {

                console.log(3)
          
              let upload_api = JSON.parse(responseURL.body); // Get id: upload_api.body.uploads[0].id // Get Presigned URL: upload_api.body.uploads[0].presigned_url
          
              var optionsUpload = {
                'method': 'PUT',
                'url': `${upload_api.body.uploads[0].presigned_url}`,
                'headers': {
                  'Content-Type': 'application/octet-stream'
                },
                body: `${uploadedFile}`
              };
          
              request(optionsUpload, function (errorUpload, responseUpload) {
                if (errorUpload) {

                  console.log(errorUpload);

                  res.status(200).json({"upload": 0})
                } else {

                  console.log(responseUpload);

                  // If upload is successful
                  res.status(200).json({"upload": 1})
                  
                }                
              });
          
            }
            
        }); 
        
        // If Video is not a video, don't upload it
        } else {
          console.log(01)
          res.status(200).json({"upload": 0})
        }

        // If No file uploaded, then do not upload anything
        } else {
          console.log(02)
          res.status(200).json({"upload": 0})
        }

    },

    // Object function to load front page.
    search: async (req, res) => {

    let search = req.query.search; // Get url query

    try {

        let options = {
          'method': 'GET',
          'url': 'https://api.thetavideoapi.com/uploadhttps://api.thetavideoapi.com/video/srvacc_13276wt681aczeh0xys067gz1/list?page=1&number=100',
          'headers': {
            'x-tva-sa-id': 'srvacc_13276wt681aczeh0xys067gz1',
            'x-tva-sa-secret': '4ucqfwvzve8mnmxxz0rmzjb2dr2nyqmv'
          }
        };
        
        //let response = await request(options).promise();
        //let videos = JSON.stringify(JSON.parse(response.Body), null, 4);
        //console.log(videos);

        let json = JSON.parse(videodata);

        let moviesFound = json.body.videos;

        res.render('search.ejs', {
            title: " ",
            message: '',
            movies: moviesFound
        });
      
    } catch (error) {
          console.error(`Request failed: ${error}`);
    }

    },

    // Object function to load about page
    about: (req, res) => {
        res.render('about.ejs', {
            title: " "
            ,message: ''
        });
    },     
};


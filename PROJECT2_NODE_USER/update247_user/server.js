const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path'); // Import path module
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Connect to MongoDB
// const {MongoClient} = require('mongodb');
const { MongoClient, ObjectId } = require('mongodb');

const assert = require('assert');
const url = "mongodb://db_container:27017";
const dbName = 'BGDb';
const client = new MongoClient(url);

// app.use(express.static('public')); // Assuming your HTML file is in the 'public' directory
app.use(express.urlencoded({ extended: true }));

// API endpoint for fetching images
app.get('/api/images', async (req, res) => {
  try {
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection('projects');
    const data = await collection.find({}).toArray();

    // Extract image links from each JSON entity
    const imagesData = data.reduce((acc, entity) => {
      if (entity.image_link) {
        acc.push(entity.image_link);
      }
      return acc;
    }, []);

    res.json(imagesData);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for fetching newsdata
app.get('/api/news', async (req, res) => {
  try {
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection('projects');
    const data = await collection.find({}).sort({ publishedAt: 1 }).limit(3).toArray();

    // Extract title and content from each document
    const newsList = data.map(({ title, content }) => ({ title, content }));

    res.json(newsList);

  } catch (error) {
    console.error('Error fetching News:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to render the login page
app.get('/', (req, res) => {
  res.render('pages/home');
});


// Route for contactus landing
app.get('/contactus', (req, res) => {
  
  res.render('pages/contactus', { message: 'Enter your Query' });
});


// Route for aboutus landing
app.get('/aboutus', (req, res) => {
  res.render('pages/aboutus')
});


// Route for sports landing
app.get('/sports', (req, res) => {
  res.render('pages/sports')
});

// send email functonality
app.post('/sendemail', async (req, res) => {
  const {email, query } = req.body;

  // Create a nodemailer transporter using your email service details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhamdpatil59@gmail.com', 
      pass: 'lgpi ujdx eisz dapz' //add the app passwords here
      // ref: https://support.google.com/accounts/answer/185833?hl=en#zippy=%2Cwhy-you-may-need-an-app-password
    }
  });

  // Email options
  const mailOptions = {
    from: 'shubhamdpatil59@gmail.com',
    to: 'studygate96@gmail.com', 
    subject: 'New Query',
    text: `Email: ${email}\nQuery: ${query}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Email sent:', info.response);
      res.render('pages/contactus', { message: 'Query sent Successfully' });
    }
  });
  
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

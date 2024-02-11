// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const path = require('path'); // Import path module
// const crypto = require('crypto');

// const app = express();
// const PORT = 3000;

// // Set EJS as the view engine
// app.set('view engine', 'ejs');

// // Secret key for JWT
// const secretKey = crypto.randomBytes(32).toString('hex');
// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// function authenticateToken(req, res, next) {
//   // Get token from request headers
//   const token = req.cookies.token;
//   //console.log(token)

//   // Check if token is provided
//   if (!token) 
//     return res.status(401).redirect('/');

//   // Verify token
//   jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) return res.status(403).send('Invalid token');
//       req.user = decoded; // Set decoded user data to request object
//       next(); // Move to the next middleware
//   });
// }

// // Connect to MongoDB
// // const {MongoClient} = require('mongodb');
// const { MongoClient, ObjectId } = require('mongodb');

// const assert = require('assert');
// const url = "mongodb://localhost:27017";
// const dbName = 'BGDb';
// const client = new MongoClient(url, { useUnifiedTopology: true });


// // Route to render the login page
// app.get('/', (req, res) => {
//   res.render('pages/login',{message :'Please Provide your login details'});
// });





// // Route to handle login form submission
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   await client.connect();
//   const dbo = client.db(dbName);

//   const collectionExists = await dbo.listCollections({ name: Project }).hasNext();
//   if (!collectionExists){
//     await dbo.createCollection('Project');
//   }
  
//   const collectionExists2 = await dbo.listCollections({ name: User }).hasNext();
//   if (!collectionExists2){
//     await dbo.createCollection('User');
//   }
  

//   const collection = dbo.collection('User');

//   // Find user by email
//   const user = await collection.findOne({ email });
//   console.log(user)
//   if (user) {
//     // Compare provided password with stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (isPasswordValid) {
//       const token = jwt.sign({ userId: user._id }, secretKey);

//       // Send JWT as a response
//       res.cookie('token', token, { httpOnly: true });

//       // Redirect to DataView or render the view you desire
//       res.redirect('./dataView');
//     } else {
//       res.render('pages/login', { message: 'Invalid username or password' });
//     }
//   } else {
//     res.render('pages/login', { message: 'Invalid username or password' });
//   }

//   client.close();
// });


// // Route for admin landing
// app.get('/admin', authenticateToken, (req, res) => {
//   // If token is valid, render the landing page
//   //console.log('User:', req.user); // Log user data
//   res.render('pages/admin', { message: ""})
// });


// app.post('/register', async (req, res) => {
//   const { regName, regEmail, regPassword } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(regPassword, 10);

//     await client.connect();
//     const dbo = client.db(dbName);

//     const collectionExists = await dbo.listCollections({ name: Project }).hasNext();
//     if (!collectionExists){
//       await dbo.createCollection('Project');
//     }
    
//     const collectionExists2 = await dbo.listCollections({ name: User }).hasNext();
//     if (!collectionExists2){
//       await dbo.createCollection('User');
//     }


//     const collection = dbo.collection('User');

//     const newUser = {
//       name: regName,
//       email: regEmail,
//       password: hashedPassword
//     };

//     await collection.insertOne(newUser);

//     // Render the registration success message on the same page
//     res.render('pages/login', { message: 'User registered successfully!' });
//   } catch (error) {
//     console.error(error);
//     if (error.code === 11000) {
//       res.render('pages/login', { message: 'Email already exists.' });
//     } else {
//       res.render('pages/login', { message: 'Internal Server Error' });
//     }
//   } finally {
//     client.close();
//   }
// });




// app.get('/addData', authenticateToken, (req, res) => {
//   // If token is valid, render the landing page
//   //console.log('User:', req.user); // Log user data
//   res.render('pages/addData', { message: ""})
// });



// app.post('/addData', authenticateToken, async (req, res) => {
//   const {image_link, title, content, publishedAt } = req.body;

//   await client.connect()
//   const dbo = client.db(dbName)
//   const collection = dbo.collection('Project')
//   const data = await collection.insertOne({image_link, title, content, publishedAt})
//   res.render('pages/addData', { message: 'News Added Successfully' });
//   client.close();
// });


// app.post('/editData', authenticateToken, async (req, res) => {
//   const {newsId, image_link, title, content, publishedAt } = req.body;

//   await client.connect()
//   const dbo = client.db(dbName)
//   const collection = dbo.collection('Project')
//   const data = await collection.updateOne(
//     { _id: new ObjectId(newsId) },
//     {
//       $set: {
//         image_link: image_link,
//         title: title,
//         content: content,
//         publishedAt: publishedAt
//       }
//     }
//   )
  
  
//   const disp = await collection.find({}).toArray()
//   res.render('pages/dataView', { data: disp })
//   client.close();
// });


// app.get('/dataView', authenticateToken, async (req, res) => {
//   await client.connect()
//   const dbo = client.db(dbName)
//   const collection = dbo.collection('Project')
//   const data = await collection.find({}).toArray()
//   //console.log(data)
//   res.render('pages/dataView', { data: data })
// });


// // Add these routes to server.js

// app.post('/deleteNews', authenticateToken, async (req, res) => {
//   const { newsId } = req.body;

//   await client.connect();
//   const dbo = client.db(dbName);
//   const collection = dbo.collection('Project');

//   // Delete news by _id
//   const result = await collection.deleteOne({ _id: new ObjectId(newsId) });

//   res.redirect('./dataView'); // Redirect to the data view after deletion
//   client.close();
// });

// app.get('/editNews', authenticateToken, async (req, res) => {
//   const { newsId } = req.query;

//   await client.connect();
//   const dbo = client.db(dbName);
//   const collection = dbo.collection('Project');

//   // Find news by _id
//   const news = await collection.findOne({ _id: new ObjectId(newsId) });

//   res.render('pages/editpage', { data: news });
//   client.close();
// });

// // Add the editNews route to handle the form submission for editing news
// app.post('/editNews', authenticateToken, async (req, res) => {
//   const { newsId, image_link, title, content, publishedAt } = req.body;

//   await client.connect();
//   const dbo = client.db(dbName);
//   const collection = dbo.collection('Project');

//   // Update news by _id
//   await collection.updateOne(
//     { _id: ObjectId(newsId) },
//     { $set: { image_link, title, content, publishedAt } }
//   );

//   res.redirect('/dataView'); // Redirect to the data view after editing
//   client.close();
// });



// app.get('/logout', (req, res) => {
//   res.clearCookie('token');
//   console.log(req.cookies.token)
//   res.redirect('/')
// })

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

const secretKey = crypto.randomBytes(32).toString('hex');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// mongoose.connect('mongodb://localhost:27017/BGDb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));



const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const projectSchema = new mongoose.Schema({
  image_link: String,
  title: String,
  content: String,
  publishedAt: Date,
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect('/');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
}

app.get('/', (req, res) => {
  res.render('pages/login', { message: 'Please Provide your login details' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // const collectionExists = await User.exists();
    // if (!collectionExists) {
    //   await mongoose.connection.createCollection('User');
    // }

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ userId: user._id }, secretKey);

        res.cookie('token', token, { httpOnly: true });
        res.redirect('./dataView');
      } else {
        res.render('pages/login', { message: 'Invalid username or password' });
      }
    } else {
      res.render('pages/login', { message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.render('pages/login', { message: 'Internal Server Error' });
  }
});

app.get('/admin', authenticateToken, (req, res) => {
  res.render('pages/admin', { message: '' });
});

app.post('/register', async (req, res) => {
  const { regName, regEmail, regPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(regPassword, 10);

    const collectionExists = await User.exists();
    if (!collectionExists) {
      await mongoose.connection.createCollection('User');
    }

    const collectionExists2 = await Project.exists();
    if (!collectionExists2) {
      await mongoose.connection.createCollection('Project');
    }

    const newUser = new User({
      name: regName,
      email: regEmail,
      password: hashedPassword,
    });

    await newUser.save();

    res.render('pages/login', { message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.render('pages/login', { message: 'Email already exists.' });
    } else {
      res.render('pages/login', { message: 'Internal Server Error' });
    }
  }
});

app.get('/addData', authenticateToken, (req, res) => {
  res.render('pages/addData', { message: '' });
});

app.post('/addData', authenticateToken, async (req, res) => {
  const { image_link, title, content, publishedAt } = req.body;

  try {
    // const collectionExists = await Project.exists();
    // if (!collectionExists) {
    //   await mongoose.connection.createCollection('Project');
    // }

    const newProject = new Project({ image_link, title, content, publishedAt });
    await newProject.save();

    res.render('pages/addData', { message: 'News Added Successfully' });
  } catch (error) {
    console.error(error);
    res.render('pages/addData', { message: 'Internal Server Error' });
  }
});

app.post('/editData', authenticateToken, async (req, res) => {
  const { newsId, image_link, title, content, publishedAt } = req.body;

  try {
    await Project.findByIdAndUpdate(newsId, {
      image_link,
      title,
      content,
      publishedAt,
    });

    const data = await Project.find({});
    res.render('pages/dataView', { data });
  } catch (error) {
    console.error(error);
    res.render('pages/dataView', { message: 'Internal Server Error' });
  }
});

app.get('/dataView', authenticateToken, async (req, res) => {
  try {
    const data = await Project.find({});
    res.render('pages/dataView', { data });
  } catch (error) {
    console.error(error);
    res.render('pages/dataView', { message: 'Internal Server Error' });
  }
});

app.post('/deleteNews', authenticateToken, async (req, res) => {
  const { newsId } = req.body;

  try {
    await Project.findByIdAndDelete(newsId);
    res.redirect('./dataView');
  } catch (error) {
    console.error(error);
    res.redirect('./dataView');
  }
});

app.get('/editNews', authenticateToken, async (req, res) => {
  const { newsId } = req.query;

  try {
    const data = await Project.findById(newsId);
    res.render('pages/editpage', { data });
  } catch (error) {
    console.error(error);
    res.redirect('./dataView');
  }
});

app.post('/editNews', authenticateToken, async (req, res) => {
  const { newsId, image_link, title, content, publishedAt } = req.body;

  try {
    await Project.findByIdAndUpdate(newsId, {
      image_link,
      title,
      content,
      publishedAt,
    });

    res.redirect('/dataView');
  } catch (error) {
    console.error(error);
    res.redirect('/dataView');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

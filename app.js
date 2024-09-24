const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const collection = require("./models/mongodb")

const app = express();
const port = 3000;

app.use(express.json())
app.use(session({
  secret: 'secure',  
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
  if (req.session.username) {
    // User is logged in, continues with the request
    next();
  } else {
    // User is not logged in, redirects to the login page
    res.redirect('/login');
  }
};

app.get('/', async (req, res) => {
  try {
    const username = req.session.username;

    // Initializing user as null if not logged in
    let user = null;

    if (username) {
      user = await collection.findOne({ username });
      if (!user) {
        return res.status(404).send('User not found');
      }
    }

    res.render('home', { user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/login', (req, res) => {
  res.render("login")
});

app.get('/signup', (req, res) => {
  res.render("signup")
});

app.get('/predict',checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dfhg.html'));
});

app.get('/symptoms', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'symptoms.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});
app.get('/maps', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'maps.html'));
});
app.get('/history',checkLoggedIn, async (req, res) => {
  try {
    const username = req.session.username; 

    if (!username) {
      return res.status(404).send('User not found');
    }

    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('history', { user });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirecting the user to the home page after logout
      res.redirect('/');
    }
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { username, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.send("Username already exists. Please choose a different one.");
    }

    if (password.length < 6) {
      return res.send("Password should contain at least 6 characters.");
    }

    const user = new collection({
      username,
      name,
      password: hashedPassword,
      predictions: []
    });

    await user.save();
    console.log("User created:", user);

    // Set the session variable
    req.session.username = user.username;

    res.render("home", { user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ username: req.body.username });

    console.log("found user:",user);
    if (user && user.password === req.body.password) {
      req.session.username = user.username;
      console.log("User logged in:", req.session.username);
      res.render("home", { user });
    } else {
      res.send("wrong password");
    }
  } catch (error) {
    console.error('Error checking login:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/predict', async (req, res) => {

  try {
    // console.log("Request body:", req.body);

    const username = req.body.username;
    console.log("Attempting to find user with username:", username);

    const user = await collection.findOne({ username });
    console.log("Found user for prediction:", user);


    console.log("found user for prediction:",user);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const features = [];
    for (let i = 1; i <= 21; i++) {
      const featureKey = `feature_{{ ${i} }}`;
      const featureValue = parseFloat(req.body[featureKey]);
      features.push(featureValue);
    }
    const apiUrl = 'http://127.0.0.1:5000/predict';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_data: features }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const predictionResult = {
      input_data: features,
      prediction: parseInt(data.prediction),
      message: data.message,
    };

    user.predictions.push(predictionResult);
    await user.save();

    res.render('result', { prediction: predictionResult.prediction, message: predictionResult.message });
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
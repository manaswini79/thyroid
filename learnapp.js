const express = require('express'); //web application framework
const bodyParser = require('body-parser'); //middleware to parse incoming request bodies
const session = require('express-session'); //middleware for managing user sessions
const path = require('path'); // working with file and directory paths
const ejs = require('ejs'); //embedded java script ,rendering html pages
const collection = require("./models/mongodb") //importing mongoDB collection module for user data and predictions
 
const app = express(); //initialize express application
const port = 3000; //set the port number

//middleware setup/rre
app.use(express.json()) //middleware to parse JSON-encoded bodies of requests
app.use(session({   
  secret: 'secure',  
  resave: false,
  saveUninitialized: true,
})); // middleware to manage user sessions,configuring options02

app.set('view engine', 'ejs'); //sets EJS as the view engine for rendering dynamic HTML pages
app.set('views', path.join(__dirname, 'views')); // specifies where ejs files are located

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true })); //middleware to parse URL -encoded bodies of requests
app.use(express.static('public')); // middleware to serve static files from public directory

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

//route for home page
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
  res.sendFile(path.join(__dirname, 'views', 'predict.html'));
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
      return res.status(404).send('User not found'); //checking if the user is logged
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

//user authentication and session handling
//post endpoints: handle user signup, login,prediction requests and logout
//mongoDB integration: saves user data and predictions to MongoDB
//session handling: sets and destroys sessions upon login and logout
app.post("/signup", async (req, res) => {
  try {
    const { username, name, password } = req.body;

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
      password,
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
      const featureKey = feature_`{{ ${i} }}`;
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

//starts the server and listens to the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
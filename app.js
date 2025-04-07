const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Register '.mustache' extension
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));

// Navigation: Home
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});

const session = require('express-session');

// Session middleware
app.use(session({
  secret: 'mysecretkey', // replace with env variable in real apps
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 min for demo
}));

// Count page views
app.use((req, res, next) => {
  if (!req.session.views) req.session.views = 0;
  req.session.views++;
  console.log(`Session views: ${req.session.views}`);
  next();
});

// Custom middleware: Logs method, URL, and timestamp
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // move to the next middleware or route
  });

// Navigation: Profile with Route Param
app.get('/profile/:username', (req, res) => {
  const { username } = req.params;
  res.render('profile', { username });
});

// Form POST handler
app.post('/submit-form', (req, res) => {
  console.log('Form Data:', req.body);
  res.send('Form submitted successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.render('home', { title: 'Home Page', views: req.session.views });
  });
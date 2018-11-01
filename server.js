const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoUri =  process.env.MONGODB_URI || 'mongodb://localhost:27017/Music';
const port = process.env.PORT || 3000;
const session = require('express-session');

app.use(session({
  secret: "feedmeseymour",
  resave: false,
  saveUninitialized: false
}));

// Middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express.static("public"));

// Checks to see if the user is logged in
app.get("/log", (req, res) => {
  if(req.session.currentUser){
    res.json(req.session.currentUser);
  } else {
    res.status(401).json({
      status: 401,
      message: "Not logged in"
    });
  }
});

// Controllers for other routes
const userController = require('./controllers/users.js');
app.use('/users', userController);
const playlistController = require('./controllers/playlist.js');
app.use('/playlists', playlistController);
const sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);

app.listen(port, () => {
  console.log('listening......');
});

// Connect to Mongo
mongoose.connect(mongoUri);
mongoose.connection.once("open", () => {
  console.log("Connected to mongoose!");
});

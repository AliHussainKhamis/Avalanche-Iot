// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require("morgan")
const methodOverride = require("method-override")
const conntectToDB = require('./config/db')
const session = require("express-session")

// Middleware
app.use(express.static('public')); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride("_method")); // Changes the method based on the ?_method
app.use(morgan("dev")) // logs the requests as they are sent to our sever in the terminal

app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
); // uses the secret session code in the .env to encrypt the token



// connect to database
conntectToDB()


// 1
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const deviceRoutes = require('./routes/device.routes')
app.use('/device',deviceRoutes)


// Routes go here

const port = process.env.PORT || 7000


app.listen(port,()=>{
    console.log("Listening on port " + port)
}) // Listen on port 7000





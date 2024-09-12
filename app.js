const express = require ("express");
const cors = require("cors");
const axios = require("axios")
const session = require("express-session")
const MemoryStore = require('memorystore')(session)
const {NotFoundError} = require("./expressError");
const {authenticateJWT} = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipes");
const planRoutes = require("./routes/mealPlans");
const listRoutes = require("./routes/shoppingLists");



const morgan = require("morgan");

const app = express();


app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}))




app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);



app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/plans", planRoutes);
app.use("/lists", listRoutes);


/** Handles favicon.ico 404 error */
app.use(function(req,res,next){
    if(req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico'){
        return res.sendStatus(204);
    }
    next();
});

/**Handle 404 errors -- this matches everything */
app.use(function(err,req,res,next){
    return next(new NotFoundError());
});


/** Generic error handler; anything unhandled goes here */
app.use(function(err,req,res,next){
    if(process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status},
    });
});

module.exports = app;



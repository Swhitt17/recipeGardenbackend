const express = require ("express");
const cors = require("cors");
const axios = require("axios")
const session = require("express-session")
const {NotFoundError} = require("./expressError");
const {authenticateJWT} = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipes");
const planRoutes = require("./routes/mealPlans");
const listRoutes = require("./routes/shoppingLists");



const morgan = require("morgan");

const app = express();

app.use(session({secret:"your-secret-key", resave:false, saveUninitialized: true}))


app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// app.post('/register', (req, res) => { 
//     const { username,firstName, lastName, email } = req.body; 
//      req.session.user = { username, email, firstName, lastName }; res.send('Registration successful!'); 
//     });
// app.post('/spoonacular-connect', async (req, res) => {
//         const user = req.session.user; 
//         if (!user) { return res.status(401).send('User not registered or session expired'); } 
//         const spoonacularApiKey = "f2c5d0c51e4c4a7ea7703510f392eb82"; 
//         const spoonacularApiUrl = `https://api.spoonacular.com/users/connect?apiKey=${spoonacularApiKey}&username=${user.username}&email=${user.email}`;       
//             const response =  await axios.post (`https://api.spoonacular.com/users/connect?apiKey=${spoonacularApiKey}`,
//                {username: req.session.username,
//                 firstName: req.session.firstName,
//                 lastName: req.session.lastName,
//                 email: req.session.email
//                });
//                console.log(response, "response");
//          res.send(`Spoonacular connect request sent for ${user.username}`); 
//         });

  

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



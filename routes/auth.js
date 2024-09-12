"use strict";

/** Routes for authentication */
const jsonschema = require("jsonschema");
// const session = require("express-session")
const User = require("../models/user");
const express = require("express");
const {createToken} = require("../helpers/token");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json")
const {BadRequestError} = require("../expressError");
const {API_KEY} = require("../config");
const { ensureLoggedIn } = require("../middleware/auth");
const axios = require("axios");
const session = require("express-session");
const db = require("../db");




const router = new express.Router();

/** POST /auth/register: {user} => {token}
 * 
 * User must include {username,password,firstName, lastName, email}
 * 
 * Returns JWT token which can be used authenticate further requests
 * 
 * Authorization required: none
*/

router.post("/register", async function(req,res,next){
    console.log("hi", req.body)
  
    try{
        const validator = jsonschema.validate(req.body,userRegisterSchema);
        if(!validator.valid){
            console.log("inside validation")
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
      
        // const newUser = await User.register({...req.body, isAdmin:false});
        // console.log(req.body, "req.body")

        const { username,firstName, lastName, email } = req.body; 
        req.session.user = { username, email, firstName, lastName }; 
        
        
        // const spoonacularApiKey = "f2c5d0c51e4c4a7ea7703510f392eb82";        
        const response =  await axios.post (`https://api.spoonacular.com/users/connect?apiKey=${API_KEY}`,
           {username: req.session.username,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            email: req.session.email
           });
        //    console.log(response, "response");
           req.session.username = response.data.username;
           req.session.password = response.data.spoonacularPassword;
           req.session.userHash  = response.data.hash;
           console.log(req.session.username, "req.session-username")
           console.log(req.session.password, "req.session.password")
           console.log(req.session.userHash, "req.session.hash")
   
           const newUser = await User.register({...req.body,  spUsername:req.session.username , spPassword:req.session.password, userHash: req.session.userHash, isAdmin:false, });
            const token = createToken(newUser);
        return res.status(201).json({token, data: response.data});
    
    }
    catch(err){
        return next(err);
    }

});



/** POST /auth/login: {username,password} => {token}
 *
 * Returns JWT token which can be used authenticate further requests
 * 
 * Authorization required: none
*/

router.post("/login", async function (req,res,next){
    console.log("login")
    try{
        const validator = jsonschema.validate(req.body,userAuthSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const {username,password} = req.body;
        const user = await User.authenticate(username,password);
        console.log(user, "user")
        let userData = null;
        if(user){
            console.log(user, "user2")
            userData = await User.getData(username)
   
        }

        const token = createToken(user);
        // console.log(username, 'username')
        // console.log(userData, "userData")
        return res.json({token,  userData});
    }
    catch(err){
        return next(err);
    }
});





module.exports = router;
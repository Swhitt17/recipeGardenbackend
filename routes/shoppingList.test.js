/** Routes for shopping lists */


const axios = require("axios");
const express = require("express");
const {ensureCorrectUserOrAdmin} = require("../middleware/auth");
const {API_KEY} = require("../config")
const User = require("../models/user")



const router = express.Router({mergeParams: true});

/** POST /[startDate]/[endDate] => {shoppingList}
 * 
 * 
*/
router.post("/:startDate/:endDate", async function (req,res,next){
    console.log("generate")


    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
//    console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")
    
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    console.log(startDate, "start")
    console.log(endDate, "end")
    try{
       

        const response = await axios.post(
            `https://api.spoonacular.com/mealplanner/${sUsername}/shopping-list/${startDate}/${endDate}?hash=${sHash}&apiKey=${API_KEY}`, 
        );
        return res.json(response.data);
    }
    catch (err){
        return next(err);
    }
})

/** GET / => {shoppingList}
 * 
 * Returns {items, aisle, parse}
 * 
 * Authorization require: user or admin
 */
router.get("/", async function(req,res,next){
    console.log("list")

    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
   console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")

 
    try{
        const response = await axios.get(
            `https://api.spoonacular.com/mealplanner/${sUsername}/shopping-list?hash=${sHash}&apiKey=${API_KEY}`

        );
        // console.log(response.data.startDate,"startDate")
        // console.log(response.data.endDate, "endDate")
        let start = Date(response.data.startDate);
        let end = Date(response.data.endDate)
     
        // console.log(response.data.aisles)
   
        return res.json({aisles: response.data.aisles});
    }
    catch(err){
        return next(err);
    }
});

/** POST / => {item} => {list} 
 * 
 * item should be {item, aisle, parse}
 * 
 * Returns {item, aisle, parse}
 * 
 * Authorization required: user or admin
*/
router.post("/",  async function(req,res,next){
  
    console.log("add to list")
  
    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
   console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")
   console.log(req.body, "body")

    try{
        const response = await axios.post(
            `https://api.spoonacular.com/mealplanner/${sUsername}/shopping-list/items?hash=${sHash}&apiKey=${API_KEY}`,
            {item:req.body.item, aisle:"", parse:true} 
        );

        return res.json(response.data);
    }
    catch(err){
        return next(err);
    }
});



/** DELETE /[id] => {deleted: id} 
 * 
 * Authorization required: user or admin
*/
router.delete("/:id",  async function(req,res,next){
    console.log("delete item")
    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
   console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")


    console.log("delete")
    const id = req.params.id;
    console.log(id)
    console.log(req.params)
    try{
         await axios.delete(
             `https://api.spoonacular.com/mealplanner/${sUsername}/shopping-list/items/${id}?hash=${sHash}&apiKey=${API_KEY}`
            
         );
        return res.json({deleted: id});
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;



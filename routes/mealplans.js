/** Routes for meal plans */

const express = require("express");
const axios = require("axios");
const {ensureCorrectUserOrAdmin} = require("../middleware/auth");
const {API_KEY} = require("../config")
const User = require("../models/user");



const router = express.Router({mergeParams: true});


/** POST  {mealPlan} => {mealPlan}
 * 
 * mealPlan should be {date, slot, position, type, id, servings, title}
 * 
 * date: as timestamp
 * 
 * slot: refers to meal so options are 1,2,or 3
 * 
 * position: refers to order within the slot
 * 
 * Returns {date, slot, position, type, id, servings, title}
 * 
 * Authorization required: user or admin
*/

router.post("/",  async function(req,res,next){
    console.log("plan add")

    let username = res.locals.user.username;
     console.log(res.locals.user.username," locals username")
    let userData = await User.getData(username)
    console.log(userData, "data")

    const sUsername = userData.spUsername;
    const sHash = userData.userHash;
   
 
    console.log(sHash, "hash")
    console.log(sUsername, " sp username")
    console.log(req.body, "req.body")
    console.log(Number(req.body.position), "position")
    console.log(req.body.position, "position")
   
   
    try{
 
        const response = await axios.post(
            `https://api.spoonacular.com/mealplanner/${sUsername}/items?hash=${sHash}&apiKey=${API_KEY}`,

            {date: req.body.date,
             slot:req.body.slot*1, 
            position: Number(req.body.position),
            type: req.body.type,
            value:{
            id: Number(req.body.id),
            servings: Number(req.body.servings),
            title: req.body.title,
            imageType:"jpg"}});
            
           
           
        return res.json(response.data);
    }
    catch(err){
        return next(err);
    }
});



/** GET /[date] => {mealPlan}
 * 
 * mealPlan is {date, slot, position, type, id, servings, title}
 * 
 * Returns {date,day,nutrients, items}
 * 
 * date is yyyy/mm/dd
 * 
 * day is day of the week
 * 
 * Authorzation required: user or admin
 */

router.get("/:date", async function(req,res,next){
    console.log("hello there")


    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
   console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")

   
    const date = req.params.date;
    try{
        const response = await axios.get(
        `https://api.spoonacular.com/mealplanner/${sUsername}/day/${date}?hash=${sHash}&apiKey=${API_KEY}`);


        let nutrient = [];
        for( const n in response.data.nutritionSummary.nutrients ){
            nutrient.push( response.data.nutritionSummary.nutrients[n].name)
            for(let i = 0; i < nutrient.length; i++){
              }
        }
       

        let amount = [];
        for( const n in response.data.nutritionSummary.nutrients ){
            amount.push( response.data.nutritionSummary.nutrients[n].amount)
          for(let i = 0; i < amount.length; i++){
          }
            }
            
        let unit = [];
        for(const n in response.data.nutritionSummary.nutrients ){
            unit.push (response.data.nutritionSummary.nutrients[n].unit)
            for(let i = 0; i < unit.length; i++){
              }
        }
     
       let nutrientData = nutrient.map(function(value, index){
        return value + " " + amount[index] + " "+ unit[index]
       })
        //   console.log(response.data.items)      
        return res.json({
            day: response.data.day,
            items: response.data.items,
            nutrient: nutrientData,
           
    });
    }
    catch(err){
        return next(err);
    }
});

/**DELETE /[id] => {deleted: id} 
 * 
 * Authorization required: user or admin
*/

/** DELETE one item by item id */
router.delete("/:id",  async function(req,res,next){
    console.log("hi")

    let username = res.locals.user.username;
    console.log(res.locals.user.username," locals username")
   let userData = await User.getData(username)
   console.log(userData, "data")

   const sUsername = userData.spUsername;
   const sHash = userData.userHash;
   console.log( userData.spUsername, " data username")

   console.log(sHash, "hash")
   console.log(sUsername, " sp username")

    const id = +req.params.id
    console.log(id, "id")
    try{
        await axios.delete(
            `https://api.spoonacular.com/mealplanner/${sUsername}/items/${id}?hash=${sHash}&apiKey=${API_KEY}`
        );
        return res.json({deleted: id });
    }
    catch(err){
        return next(err);
    }
});

/**DELETE /[date] => {cleared: date} 
 * 
 * Authorization required: user or admin
*/

// router.delete("/:date", ensureCorrectUserOrAdmin, async function(req,res,next){

//     let username = res.locals.user.username;
//     console.log(res.locals.user.username," locals username")
//    let userData = await User.getData(username)
//    console.log(userData, "data")

//    const sUsername = userData.spUsername;
//    const sHash = userData.userHash;
//    console.log( userData.spUsername, " data username")

//    console.log(sHash, "hash")
//    console.log(sUsername, " sp username")
//     const date = req.params.date
//     try{
//         await axios.delete(
//             `${BASE_URL}/mealplanner/${sUsername}/day/${date}?hash=${sHash}&apiKey=${API_KEY}`
//         );
//         return res.json({cleared: date });
//     }
//     catch(err){
//         return next(err);
//     }
// });



module.exports = router;
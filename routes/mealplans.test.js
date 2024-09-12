const request = require("supertest")
const app = require("../app");


describe("POST /plans", function(){
    test("should add item to plan", async function(){
        const response = await request(app)
        .post("/plans")
        .send({ date: 1720540023, slot: 2, position: 0, type: "RECIPE",
	    value:{
		id: 716004,
		servings: 2,
          title: "Quinoa and Chickpea Salad with Sun-Dried Tomatoes and Dried Cherries" }},
        { date: 1720540023, slot: 3, position: 3, type: "RECIPE",
            value:{
            id: 1096195,
            servings: 2,
        title:"Peanut Butter Brownie Cheesecake" }},
     );
        expect(response.statusCode).toEqual(200);
    })
})


describe("GET /plans/:date", function(){
    test("should return plan for given date", async function(){
        const response = await request(app).get("/plans/2024-07-04");
        expect (response.statusCode).toEqual(200);
    })

})


describe("DELETE /plans/:id", function(){
    test("should delete item from plan by id", async function(){
        const response = await request(app)
        .delete("/plans/716004")
        expect(response.statusCode).toEqual(200);
        expect(res.body).toEqual({deleted: 716004});
    })
})

describe("DELETE /plans/:date", function(){
    test("should clear plan for date", async function(){
        const response = await request(app)
        .delete("/plans/2024-07-04")
        expect(response.statusCode).toEqual(200);
        expect(res.body).toEqual({cleared: "2024-07-04" });
    })
})
const request = require("supertest")
const app = require("../app");

describe("GET /lists", function(){
    test("should return lists", async function(){
        const response = await request(app).get("/lists");
        expect (response.statusCode).toEqual(200);
    })

})

describe("POST /lists", function(){
    test("should add item to list", async function(){
        const response = await request(app)
        .post("/lists/:startDate/:endDate")
        .send({item: "2 bananas", aisle:"", parse:true });
        expect(response.statusCode).toEqual(200);
    })
})


describe("POST /lists/:startDate/:endDate", function(){
    test("should generate list for date", async function(){
        const response = await request(app)
        .post("/lists/2024-06-17/2014-06-13")
        expect(response.statusCode).toEqual(200);
    })
})

// describe("DELETE /lists/:id", function(){
//     test("should delete item from list by id", async function(){
//         const response = await request(app)
//         .delete("/lists/9040")
//         expect(response.statusCode).toEqual(200);
//         expect(res.body).toEqual({deleted: "2 bananas"});
//     })
// })
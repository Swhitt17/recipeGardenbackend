const request = require("supertest");
const app = require("../app");


describe("GET /recipes", function () {
    test("should return recipes", async function(){
        const response = await request(app).get("/recipes?cuisine=asian&number=5")
        expect (response.statusCode).toEqual(200)
    })

    // test("one filter works", async() => {
    //     const res = await request(app)
    //     .get(`/recipes?cuisine=african`)
    //     expect(res.body).toEqual({ 
    //         results: [
    //           {
    //             id: 632003,
    //             title: 'African Bean Soup',
    //             image: 'https://img.spoonacular.com/recipes/632003-312x231.jpg',
    //             imageType: 'jpg'
    //          },
    //          {
    //             id: 653275,
    //             title: 'North African Chickpea Soup',
    //             image: 'https://img.spoonacular.com/recipes/653275-312x231.jpg',
    //             imageType: 'jpg'

    //          },
    //        ],
    //     });
    // });

    // test("multiple filters work", async() => {
    //     const res = await request(app)
    //     .get(`/recipes?cuisine=asian&diet=vegan&dish=dessert`)
    //     expect(res.body).toEqual({ 
    //        results: [
    //           {
    //             id: 663176,
    //             title: 'Thai-Style Sticky Rice & Mango Dessert Shots',
    //             image: 'https://img.spoonacular.com/recipes/663176-312x231.jpg',
    //             imageType: 'jpg'
    //           },
    //         ],
    //     });
    // });

    // test("invalid filter doesn't work", async() => {
    //     const res = await request(app)
    //     .get(`/recipes?bad=incorrect`)
    //     expect(res.statusCode).toEqual(400);
     
    // });





test("should return recipe information by id", async function(){
    const response = await request(app).get("/recipes/716004")
    expect (response.statusCode).toEqual(200)
})

})


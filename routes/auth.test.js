process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,

} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/*************************************** POST /auth/token */
describe("POST /auth/token", function (){
    test("works", async function(){
        const res = await request(app)
        .post(`/auth/token`)
        .send({username: "u1", password: "password1",});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"token": expect.any(String)});
    });

    test("unauthorized with non-existent user", async function(){
        const res = await request(app)
        .post(`/auth/token`)
        .send({username: "nope", password: "password1",});
        expect(res.statusCode).toBe(401);
    });

    test("unauthorized with wrong password", async function(){
        const res = await request(app)
        .post(`/auth/token`)
        .send({username: "u1", password: "incorrect",});
        expect(res.statusCode).toBe(401);
    });
    test("bad request with missing data", async function(){
        const res = await request(app)
        .post(`/auth/token`)
        .send({username: "u1",});
        expect(res.statusCode).toBe(400);
    });

    test("bad request with invalid data", async function(){
        const res = await request(app)
        .post(`/auth/token`)
        .send({username: 42,password: "above-is-a-number",});
        expect(res.statusCode).toBe(400);
    });

});
/*************************************** POST /auth/register */


describe("POST /auth/register", function (){
    test("works", async function(){
        const res = await request(app)
        .post(`/auth/register`)
        .send({username: "u1",
             password: "password1",
             firstName: "Test",
             lastName: "User",
             email: "testUser1@email.com"});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"token": expect.any(String)});
    });

    test("bad request with missing data", async function(){
        const res = await request(app)
        .post(`/auth/register`)
        .send({username: "u1",
             email: "testUser1@email.com"});
        expect(res.statusCode).toBe(400);
    });

    test("bad request with invalid data", async function(){
        const res = await request(app)
        .post(`/auth/register`)
        .send({username: "u1",
            password: "password1",
            firstName: "Test",
            lastName: "User",
             email: "not-an-email"});
        expect(res.statusCode).toBe(400);
    });





});
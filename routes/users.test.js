process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken
} = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/*************************************** POST /users */

describe("POST /users", function(){
    test("admin allowed, makes non-admin user", async function(){
        const res = await request(app)
        .post(`/users`)
        .send({
            username: "new",
            password: "newPassword",
            firstName: "New",
            lastName: "User",
            email: "test@test.com",
            isAdmin: false
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect (res.body).toEqual({
            user:{
                username: "new",
            firstName: "New",
            lastName: "User",
            email: "test@test.com",
            isAdmin: false  
            }, token :expect.any(String),
        });
    });

    test("admin allowed, makes admin user", async function(){
        const res = await request(app)
        .post(`/users`)
        .send({
            username: "new",
            password: "newPassword1",
            firstName: "New",
            lastName: "User",
            email: "newuser@email.com",
            isAdmin: true
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect (res.body).toEqual({
            user:{
            username: "new",
            firstName: "New",
            lastName: "User",
            email: "newuser@email.com",
            isAdmin: true  
            }, token :expect.any(String),
        });
    });

    test("non-admin user not allowed", async function(){
        const res = await request(app)
        .post(`/users`)
        .send({
            username: "new",
            firstName: "New",
            lastName: "User",
            email: "test@test.com",
            isAdmin: true
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
        
        });

    test("not signed-in user not allowed", async function(){
            const res = await request(app)
            .post(`/users`)
            .send({
                username: "new",
                firstName: "New",
                lastName: "User",
                email: "test@test.com",
                isAdmin: true
            })
            expect(res.statusCode).toEqual(401);
            });

    test("responds with 400 for missing data", async function(){
        const res = await request(app)
        .post(`/users`)
        .send({
                username: "new",
               firstName: "New",
            })
            .set("authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(400);
    });

    test("responds with 400 for invalid data", async function(){
        const res = await request(app)
        .post(`/users`)
        .send({
            username: "new",
            firstName: 567,
            lastName: "User",
            email: "test@test.com",
            isAdmin: true
            })
            .set("authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(400);
    });
    
});

/*************************************** GET /users */

describe("GET /users", function (){
    test("admin allowed", async function () {
        const res = await request(app)
        .get(`/users`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            users:
            [
                {
                    username: "u1",
                    firstName: "UF1",
                    lastName: "UL1",
                    email:"u1@email.com",
                    isAdmin: false
                },
                {
                    username: "u2",
                    firstName: "UF2",
                    lastName: "UL2",
                    email:"u2@email.com",
                    isAdmin: false
                },
                {
                    username: "u3",
                    firstName: "UF3",
                    lastName: "UL3",
                    email:"u3@email.com",
                    isAdmin: false
                },
            ],
        });
    });

    test("non-admin user not allowed", async function(){
        const res = await request(app)
        .get(`/users`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
        
        });

        test("unrecognized user not allowed", async function(){
            const res = await request(app)
            .get(`/users`)
            expect(res.statusCode).toEqual(401);
            });

});


/*************************************** GET /users/:username */

describe("GET /users/:username", function(){
    test("admin allowed", async function(){
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect (res.body).toEqual({
            user:{
                username: "u1",
                firstName: "UF1",
                lastName: "UL1",
                email:"u1@email.com",
                isAdmin: false
           
            }
        });
    });

    test("user allowed on own", async function(){
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
        expect (res.body).toEqual({
            user:{
                username: "u1",
                firstName: "UF1",
                lastName: "UL1",
                email:"u1@email.com",
                isAdmin: false
            }
        });
    });

    test("other user not allowed", async function(){
        const res = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
       
    });

    
    test("not signed-in user not allowed", async function(){
        const res = await request(app)
        .get(`/users/u1`)
        expect(res.statusCode).toEqual(401);
    });

    test("responds with 404 invalid username", async function(){
        const res = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
       
    });

});


/*************************************** PATCH /users/:username */

describe("PATCH /users/:username", function(){
    test("admin allowed", async function(){
        const res = await request(app)
        .patch(`/users/u1`)
        .send({lastName: "UNL1"})
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect (res.body).toEqual({
            user:{
                username: "u1",
                firstName: "UF1",
                lastName: "UNL1",
                email:"u1@email.com",
                isAdmin: false
            }
        });
    });

    test("user allowed on own", async function(){
        const res = await request(app)
        .patch(`/users/u1`)
        .send({lastName: "UNL1"})
        .set("authorization", `Bearer ${u1Token}`)
        expect(res.statusCode).toEqual(200);
        expect (res.body).toEqual({
            user:{
                username: "u1",
                firstName: "UF1",
                lastName: "UNL1",
                email:"u1@email.com",
                isAdmin: false
            }
        });
    });

    test("other user not allowed", async function(){
        const res = await request(app)
        .patch(`/users/u1`)
        .send({lastName: "UNL1"})
        .set("authorization", `Bearer ${u2Token}`)
        expect(res.statusCode).toEqual(401);
       
    });

    test("not signed-in user not allowed", async function(){
        const res = await request(app)
        .patch(`/users/u1`)
        .send({lastName: "UNL1"})
        expect(res.statusCode).toEqual(401);
    });

    test("responds with 404 for invalid data", async function(){
        const res = await request(app)
        .patch(`/users/u1`)
        .send({lastName: 999})
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
       
    });
    
    test("responds with 404 for invalid username", async function(){
        const res = await request(app)
        .patch(`/users/nope`)
        .send({lastName: "UNL1"})
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });

});

/*************************************** DELETE /users/:username */

describe("DELETE /users/:username", function(){
    test("admin allowed", async function(){
        const res = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
       expect(res.body).toEqual({deleted: "u1"});
    });

    test("user allowed on own", async function(){
        const res = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(200);
       expect(res.body).toEqual({deleted: "u1"});
    });

    test("other user not allowed ", async function(){
        const res = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
        expect(res.statusCode).toEqual(401);
       
    });

    test("not signed-in user not allowed ", async function(){
        const res = await request(app)
        .delete(`/users/u1`)
        expect(res.statusCode).toEqual(401);
    });

    test("responds with 404 for invalid username", async function(){
        const res = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });

});

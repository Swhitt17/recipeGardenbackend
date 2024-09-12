const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");

const db = require("../db");
const User = require("./user")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/*************************************** authenticate */
describe("authenticate", function(){
    test("works", async function (){
        const user = await User.authenticate("u1", "password1");
        expect(user).toEqual({
            username: "u1",
            firstName: "UF1",
            lastName: "UL1",
            email: "u1@email.com",
            isAdmin: false,
        });
    });

    test("unauthorized if no such user", async function (){
        try{
          await User.authenticate("nope", "password0");
         fail();
        }
        catch(err){
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
       
    });
    
    test("unauthorized if wrong password", async function (){
        try{
          await User.authenticate("u1", "wrong");
         fail();
        }
        catch(err){
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
       
    });
});


/*************************************** register */

describe("register", function(){
    const newUser = {
        username: "new",
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        isAdmin: false
    };

    test("works", async function () {
        let user = await User.register({
            ...newUser,
            password: "password",
        });
        expect(user).toEqual(newUser);
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect (found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("works: adds admin", async function () {
        let user = await User.register({
            ...newUser,
            password: "password",
            isAdmin: true
        });
        expect(user).toEqual({...newUser, isAdmin:true});
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect (found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(true);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("bad request with duplicate data", async function (){
        try{
            await User.register({
                ...newUser,
                password: "password",
            });
            await User.register({
                ...newUser,
                password: "password",
            });
            fail();
        }
        catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/*************************************** findAll */
describe("findAll", function (){
    test ("works", async function () {
        const users = await User.findAll();
        expect (users).toEqual([
            {
                username: "u1",
                firstName: "UF1",
                lastName: "UL1",
                email: "u1@email.com",
                isAdmin: false,
            },
            {
                username: "u2",
                firstName: "UF2",
                lastName: "UL2",
                email: "u2@email.com",
                isAdmin: false,
            }
        ]);
    });
});

/*************************************** get */
describe("get", function (){
    test("works", async function () {
        const user = await User.get("u1");
        expect (user).toEqual(
            {
                username: "u1",
                firstName: "UF1",
                lastName: "UL1",
                email: "u1@email.com",
                isAdmin: false,
            });
    

   
        test("not found if no such user", async function () {
            try{
               await User.get("nope");
               fail();
            }
            catch(err){
                expect(err instanceof NotFoundError).toBeTruthy();
            }
        });
    });
});

/*************************************** update */

describe("register", function(){
    const updateUser = {
        firstName: "NewF",
        lastName: "NewL",
        email: "new@email.com",
        isAdmin: true
    };

    test("works", async function(){
        let user = await User.update("u1", updateUser);
        expect (user).toEqual({
            username: "u1",
            ...updateUser
        });
    });

    test("works: set password", async function(){
        let user = await User.update("u1",{
            password: "new"
        });
        expect (user).toEqual({
            username: "u1",
            firstName: "UF1",
            lastName: "UL1",
            email: "u1@email.com",
            isAdmin: false,
        });

        const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
        expect (found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

     
    test("bad request if no data", async function () {
        expect.assertions(1);
        try{
           await User.update("u1", {});
           fail();
        }
        catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});


/*************************************** remove */
describe("remove", function (){
    test("works", async function (){
        await User.remove("u1");
        const res = await db.query(
            `SELECT * FROM users WHERE username = 'u1'`);
            expect(res.rows.length).toEqual(0);
    });

    
    test("not found if no such user", async function () {
        try{
           await User.remove("nope");
           fail();
        }
        catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

});








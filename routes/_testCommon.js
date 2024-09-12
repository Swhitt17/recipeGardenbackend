const db = require("../db");
const User = require("../models/user");
const {createToken} = require("../helpers/token");

async function commonBeforeAll(){
    await db.query("DELETE FROM users");


await User.register({
    username: "u1",
    password: "password1",
    firstName: "UF1",
    lastName: "UL1",
    email:"u1@email.com",
    isAdmin: false
});

await User.register({
    username: "u2",
    password: "password2",
    firstName: "UF2",
    lastName: "UL2",
    email:"u2@email.com",
    isAdmin: false
});

await User.register({
    username: "u3",
    password: "password3",
    firstName: "UF3",
    lastName: "UL3",
    email:"u3@email.com",
    isAdmin: false
});
}
async function commonBeforeEach(){
    await db.query("BEGIN");
}

async function commonAfterEach(){
    await db.query("ROLLBACK");
}

async function commonAfterAll(){
    await db.end();
}

const u1Token = createToken({username:"u1", isAdmin:false});
const u2Token = createToken({username:"u2", isAdmin:false});
const adminToken = createToken({username:"admin", isAdmin:true});

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken
};
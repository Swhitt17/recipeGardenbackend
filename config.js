/** Shared config for application; can be required many places */
require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const API_KEY = "f2c5d0c51e4c4a7ea7703510f392eb82";

const PORT = +process.env.PORT || 3001;

//Use dev database, testing database, or via env, production database
function getDatabaseUri(){
    return (process.env.NODE_ENV === "test")
    ? "postgresql://selheart:jw8s0F6@localhost:5432/recipegarden_test"
    : process.env.DATABASE_URL ||  "postgresql://selheart:jw8s0F6@localhost:5432/recipegarden"
}

//Speed up bcrypt during tests, since algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1:12;

console.log("Capstone Config:".green);
console.log("SECRET_KEY:".yellow,SECRET_KEY);
console.log("PORT:".yellow,PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    API_KEY
};
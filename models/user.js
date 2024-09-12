const db = require("../db");
const bcrypt = require("bcrypt");
const {sqlForPartialUpdate} = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError")

const {BCRYPT_WORK_FACTOR} = require("../config.js");

class User{
    /** authenticate user with username,password 
     * 
     * Returns {username,first_name,last_name,email,is_admin}
     * 
     * Throws UnauthorizedError is user not found or wrong password
    */

    static async authenticate(username,password){
        const res = await db.query(
            `SELECT username,
            password,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = res.rows[0];

        if(user){
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid === true){
                delete user.password;
                return user;
            }
        }
       throw new UnauthorizedError ("Invalid username/password")
    }

    /** Register user with data 
     * 
     * Returns {username, firstName,lastName,email,isAdmin}
     * 
     * Throws BadRequsetError on duplicates
    */


    static async register({username,password, firstName, lastName, email, spUsername, spPassword, userHash, isAdmin}){
        console.log(username,password,firstName,lastName,email,spUsername, spPassword, userHash, "data")
        
        // const duplicateRes = await db.query(
        //     `SELECT username,
        //     FROM users
        //     WHERE username = $1`,
        //     [username]
        // );
        // console.log("register", duplicateRes)
        // if(duplicateRes.rows[0]){
        //     console.log("register2")
        //     throw new  BadRequestError(`Username already in use: ${username}`);
        // }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        console.log("before insert")

        const result = await db.query(
            `INSERT INTO users
            (username,
            password,
            first_name,
            last_name,
            email,
            sp_username,
            sp_password,
             user_hash,
            is_admin)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, sp_username AS "spUsername", sp_password AS "spPassword", user_hash AS "userHash", is_admin AS "isAdmin"`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                spUsername,
                spPassword,
                userHash,
                isAdmin
            ]
        );

        console.log("after insert")

        const user = result.rows[0];

        return user;
    }


    static async getData(username){
        console.log("hi from get data")
        const res = await db.query(
            `SELECT username,
             sp_username AS "spUsername",
              sp_password AS "spPassword",
              user_hash AS "userHash"
             FROM users 
             WHERE username = $1`,
             [username]
       );

       const userData = res.rows[0];

       return userData;
    }

    /** Find all users 
     * 
     * Returns [{username,first_name,last_name,email,is_admin,...}]
    */

    static async findAll(){
        const res = await db.query(
            `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
            FROM users
            ORDER BY username`,
        );

        return res.rows;
    }

    /** Given a username, return data about user
     * 
     * Returns {username, first_name, last_name, is_admin,}
     * 
     * 
     * Throws NotFoundError if user not found
     */

    static async get(username){
        console.log(username, "username")
        
        const userRes = await db.query(
             `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email, 
                is_admin AS "isAdmin"
              FROM users 
              WHERE username = $1`,
              [username],
        );
        // console.log(userRes, "user res")

        const user = userRes.rows[0];
   
        
        if(!user) throw new NotFoundError(`No user found: ${username}`);
        return user;
    }

    /** Update user data with `data` 
     * 
     * This is a "partial update" 
     * 
     * Data can include:
     * {firstName,lastName, email, isAdmin}
     * 
     * Throws NotFoundError if not found
    */

    static async update(username,data){
        if(data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const {setCols, values} = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin"
            });

            const usernameVarInd = "$" + (values.length + 1);

            const querySql = `UPDATE users
                             SET ${setCols}
                             WHERE username = ${usernameVarInd}
                             RETURNING username,
                                       first_name AS "firstName",
                                       last_name AS "lastName",
                                       email,
                                       is_admin AS "isAdmin"`;
            const res = await db.query(querySql, [...values, username]);
            const user = res.rows[0];

            if(!user) throw new NotFoundError(`No user found: ${username}`);

            delete user.password;
            return user;
    }

    /** Delete given user from database; returns undefined */

    static async remove(username){
        let res = await db.query(
            `DELETE
             FROM users
             WHERE username = $1
             RETURNING username`,
             [username]
        );

        const user = res.rows[0];
        if(!user) throw new NotFoundError(`No user found: ${username}`);

    }
    
}

module.exports = User;


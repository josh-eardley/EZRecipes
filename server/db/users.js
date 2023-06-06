const client = require("./client");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashedPassword({password}) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function checkPassword(password, hash) {
  const compare = await bcrypt.compare(password, hash)
  return compare;
}

async function createUser({email, username, password, admin}) {
    try {
        const newPassword = await hashedPassword({password});

        const {rows: [user]} = await client.query(`
            INSERT INTO users(email, username, password, admin)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, email, username, admin;
        `, [email, username, newPassword, admin])
        return user;
    } catch (error) {
        console.error("error in createUser helper func", error);
        throw error;
    }
}

async function getUser({ email, password }) {
    try {
      if(!email || !password) {
        return;
      } 
      const { rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE email = $1;
      `, [email]);
      const match = await checkPassword(password, user.password);
      if(!match) {
        return null;
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  };

  async function getUserByUsername(username) {
    try {
      const {rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE username = $1
      `, [username]);
      return user;
    } catch (error) {
      throw error;
    }
  };

module.exports = {
    createUser,
    getUser,
    getUserByUsername
}
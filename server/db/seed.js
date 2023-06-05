const client = require("./client");
const { createUser } = require("./users");

const dropTables = async () => {
    try {
        console.log("Starting to drop all tables...");
        await client.query(`
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS recipeIngredients;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS recipes;
        DROP TABLE IF EXISTS users;
        `)
        console.log("Finished dropping all tables")
    } catch (error) {
        console.error("Error dropping tables");
        throw error;
    }
}

const createTables = async () => {
    try {
        console.log("Starting to create all tables...");
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            admin BOOLEAN DEFAULT false
        );
        CREATE TABLE recipes(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            instructions TEXT NOT NULL
        );
        CREATE TABLE ingredients(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE recipeIngredients(
            id SERIAL PRIMARY KEY,
            "recipeId" INTEGER REFERENCES recipes(id),
            "ingredientId" INTEGER REFERENCES ingredients(id),
            quantity INTEGER NOT NULL,
            measurment VARCHAR(255),
            description VARCHAR(255) NOT NULL
        );
        CREATE TABLE reviews(
            id SERIAL PRIMARY KEY,
            "recipeId" INTEGER REFERENCES recipes(id),
            "userId" INTEGER REFERENCES users(id),
            description TEXT NOT NULL,
            "cookingTime" INTEGER NOT NULL,
            difficulty INTEGER NOT NULL,
            cost INTEGER NOT NULL
        );
        CREATE TABLE favorites(
            "userId" INTEGER REFERENCES users(id),
            "recipeId" INTEGER REFERENCES recipes(id)
        );
        `)
        console.log("Finished creating all tables successfully!")
    } catch (error) {
        console.error("Error creating tables");
        throw error;
    }
}

const createInitialUsers = async () => {
    console.log('Adding initial users to "Users" table...');
    try {
        const usersToCreate = [
            {email: "foo@gmail.com", username: "foo", password: "password", admin: true}
            {email: "bar@gmail.com", username: "bar", password: "12345678", admin: false}
            {email: "baz@gmail.com", username: "baz", password: "password", admin: false}
        ];
        const users = await Promise.all(usersToCreate.map(createUser));
        console.log(users);
        console.log("Finished creating initial users!")
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

const createInititalRecipes = async () => {
    console.log("Starting to create initial recipes")
    try {
        const recipesToCreate = [
            {title: , description: , instructions: }
            {title: , description: , instructions: }
            {title: , description: , instructions: }
        ]
    } catch (error) {
        console.error("Error creating recipes!");
        throw error;
    }
}
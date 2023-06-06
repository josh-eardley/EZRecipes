const client = require("./client");

const createRecipe = async ({title, photo, description, ingredients, instructions, userId}) => {
    try {
        const { rows: [recipe] } = await client.query(`
            INSERT INTO recipes(title, photo, description, ingredients, instructions, "userId")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [title, photo, description, ingredients, instructions, userId]);
        return recipe
    } catch (error) {
        console.error("error in createRecipe helper func", error);
        throw error;
    }
}

const getRecipeById = async (id) => {
    try {
        const { rows: [recipe] } = await client.query(`
          SELECT * FROM recipes
          WHERE id = $1;
        `, [id]);
        return recipe;
      } catch (error) {
        console.error(error);
      }
}

const getAllRecipes = async () => {
    try {
        const { rows: recipes } = await client.query(`
          Select * FROM recipes
          RETURNING *
          `);
        return recipes;
      } catch (error) {
        throw error;
      }
}

const updateRecipe = async ({id, ...fields}) => {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
      try {
        const { rows: [recipe] } = await client.query(`
          UPDATE recipes
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
        `, Object.values(fields));
    
        return recipe;
      } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createRecipe,
    getRecipeById,
    getAllRecipes,
}
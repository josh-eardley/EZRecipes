const client = require("./client");

const createIngredient = async (name) => {
    try {
        const {rows: [ingredient]} = await client.query(`
        INSERT INTO ingredients(name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name]);
        return ingredient;
    } catch (error) {
        throw error;
    }
}

const destroyIngredient = async (id) => {
    try {
        const { rows: [ingredient] } = await client.query(`
        DELETE FROM ingredients
        WHERE id = $1
        RETURNING *;
        `, [id]);
      return ingredient;
    } catch (error) {
        throw error;
    }
  }

  const getIngredientByName = async (name) => {
    try {
      const { rows: [ ingredient ] } = await client.query(`
        SELECT * FROM ingredients
        WHERE name=$1
      `, [name]);
      return ingredient;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    createIngredient,
    destroyIngredient,
    getIngredientByName
}
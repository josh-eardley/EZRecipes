const client = requite("./client");

const createRecipe = async ({title, description, instructions}) => {
    try {
        const { rows: [recipe] } = await client.query(`
            INSERT INTO recipes(title, description, instructions)
            VALUES ($1, $2, $3)
            ON CONFLICT (title) DO NOTHING
            RETURNING *;
        `, [title, description, instructions]);
        return recipe
    } catch (error) {
        console.error("error in createRecipe helper func", error);
        throw error;
    }
}
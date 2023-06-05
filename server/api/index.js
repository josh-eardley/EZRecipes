const client = require('../db/client');
const express = require('express');
const router = express.Router();
// const { getUserById } = require('../db');
const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;

router.get('/health', async (req, res, next) => {
  try {
    const uptime = process.uptime();

    const {
      rows: [dbConnection],
    } = await client.query(`SELECT NOW();`);

    const currentTime = new Date();

    const lastRestart = new Intl.DateTimeFormat('en', {
      timeStyle: 'long',
      dateStyle: 'long',
      timeZone: 'America/New_York',
    }).format(currentTime - uptime * 1000);

    res.send({
      message: 'The api is healthy!',
      uptime,
      dbConnection,
      currentTime,
      lastRestart,
    });
  } catch (error) {
    next(error);
  }
}); 

//Auth Middleware
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
    
      try {
         const { id } = jwt.verify(token, JWT_SECRET);
  
         if (id) {
            const user = await getUserById(id);
            if(user){
              req.user = user
            }
            
            next();
          }
      } catch (error) {
            next(error);
      }
    } else {
        next({
            name: 'AuthorizationError',
            message: `Authorization token must start with ${ prefix }`
          });
    }
  });

  const usersRouter = require("./users");
  router.use("/users", usersRouter);

  const recipesRouter = require("./recipes");
  router.use("/recipes", recipesRouter);

  const ingredientsRouter = require("./ingredients");
  router.use("/ingredients", ingredientsRouter);

  const recipeIngredientsRouter = require("./recipeIngredients");
  router.use("/recipeIngredients", recipeIngredientsRouter);

  const reviewsRouter = require("./reviews");
  router.use("/reviews", reviewsRouter);

  const favoritesRouter = require("./favorites");
  router.use("/favorites", favoritesRouter);

  module.exports = router;
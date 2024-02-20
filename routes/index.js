var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to PokeDex");
});

const pokemonsRouter = require("./pokemon.api");

router.use("/pokemons", pokemonsRouter);

module.exports = router;

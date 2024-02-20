const express = require("express");
const fs = require("fs");
var router = express.Router();

// Get pokemons
router.get("/", (req, res, next) => {
  const allowedFilter = ["search", "type"];

  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    console.log(filterQuery.type);
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        next(error);
      }
    });

    let offset = limit * (page - 1);
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;

    let result = [];
    result = data;

    if (filterQuery.search) {
      result = result.filter((item) => item.name.includes(filterQuery.search));
    }

    if (filterQuery.type) {
      result = result.filter((item) => item.types.includes(filterQuery.type));
    }

    result = result.slice(offset, offset + limit);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    let { id: pokemonId } = req.params;
    let previousPokemonId = null;
    let nextPokemonId = null;
    let result = {};
    pokemonId = parseInt(pokemonId);
    if (pokemonId === 809) {
      nextPokemonId = 1;
      previousPokemonId = pokemonId - 1;
    } else if (pokemonId === 1) {
      previousPokemonId = 809;
      nextPokemonId = pokemonId + 1;
    } else {
      previousPokemonId = pokemonId - 1;
      nextPokemonId = pokemonId + 1;
    }

    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    let { data } = db;

    data = data.filter((item) => {
      if (item.id === previousPokemonId) return true;
      else if (item.id === nextPokemonId) return true;
      else if (item.id === pokemonId) return true;
      else return false;
    });

    result.pokemon = data.find((item) => item.id === pokemonId);
    result.previousPokemon = data.find((item) => item.id === previousPokemonId);
    result.nextPokemon = data.find((item) => item.id === nextPokemonId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

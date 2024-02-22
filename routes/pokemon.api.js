const express = require("express");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
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
        throw exception;
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
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    let { data } = db;
    pokemonId = parseInt(pokemonId);
    const indexOfPokemon = data.findIndex((item) => item.id === pokemonId);
    console.log(indexOfPokemon);
    let previousPokemonId = null;
    let nextPokemonId = null;
    let result = {};
    if (pokemonId === data[data.length - 1].id) {
      nextPokemonId = 1;
      previousPokemonId = data[data.length - 2].id;
    } else if (pokemonId === 1) {
      previousPokemonId = data[data.length - 1].id;
      nextPokemonId = pokemonId + 1;
    } else {
      previousPokemonId = data[indexOfPokemon - 1].id;
      nextPokemonId = data[indexOfPokemon + 1].id;
    }

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

router.post("/", (req, res, next) => {
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flyingText",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];
  try {
    let { name, id, url, types } = req.body;
    // console.log(types);
    if (!name || !id || !url || types.length === 0) {
      const exception = new Error("Missing required data");
      exception.statusCode = 401;
      throw exception;
    }

    if (types.length > 2) {
      const exception = new Error("Pokémon can only have one or two types");
      exception.statusCode = 401;
      throw exception;
    }

    types.forEach((type) => {
      if (!pokemonTypes.includes(type)) {
        const exception = new Error("Pokemon's types is not valid");
        exception.statusCode = 401;
        throw exception;
      }
    });

    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    let { data, totalPokemons } = db;
    data.forEach((pokemon) => {
      if (pokemon.name === name || pokemon.id === id) {
        const exception = new Error("The Pokémon already exists");
        exception.statusCode = 401;
        throw exception;
      }
    });

    url = faker.image.url();
    weight = faker.number.int({ min: 10, max: 1000 });
    height = faker.number.int({ min: 10, max: 1000 });
    category = faker.animal.type();
    abilities = faker.music.genre();
    description = faker.string.sample({ min: 10, max: 30 });
    id = parseInt(id);
    const result = {
      id,
      name,
      types,
      url,
      weight,
      height,
      category,
      abilities,
      description,
    };

    data.push(result);
    totalPokemons += 1;

    db.data = data;
    db.totalPokemons = totalPokemons;

    fs.writeFileSync("pokemons.json", JSON.stringify(db));
    res.status(200).send("Success");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", (req, res, next) => {
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flyingText",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];
  try {
    let { id } = req.params;
    id = parseInt(id);
    let { name, url, types } = req.body;
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    let { data } = db;

    const pokemonUpdate = data.find((item) => item.id === id);
    const pokemonUpdateIndexInArray = data.findIndex((item) => item.id === id);

    if (name) {
      data.forEach((item) => {
        if (name === item.name) {
          const exception = new Error("The Pokémon name already exists");
          exception.statusCode = 401;
          throw exception;
        }
      });
      pokemonUpdate.name = name;
    }

    if (url) {
      pokemonUpdate.url = faker.image.url();
    }

    if (types.length > 0) {
      types.forEach((type) => {
        if (!pokemonTypes.includes(type)) {
          const exception = new Error("Pokemon's types is not valid");
          exception.statusCode = 401;
          throw exception;
        }
      });
      types.forEach((type, index) => {
        pokemonUpdate.types[index] = type;
      });
    }

    data.splice(pokemonUpdateIndexInArray, 1, pokemonUpdate);

    db.data = data;

    fs.writeFileSync("pokemons.json", JSON.stringify(db));
    res.status(200).send("Success");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    let { data, totalPokemons } = db;
    data = data.filter((item) => item.id !== id);
    totalPokemons -= 1;
    db.totalPokemons = totalPokemons;
    db.data = data;
    fs.writeFileSync("pokemons.json", JSON.stringify(db));
  } catch (error) {
    next(error);
  }
});

module.exports = router;

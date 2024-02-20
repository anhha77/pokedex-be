const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");

const createData = async () => {
  let pokemonsData = await csv().fromFile("pokemon.csv");
  let pokemonsImageData = fs.readdirSync("./public/images");
  const pokemonsName = pokemonsImageData.map((item) => path.parse(item).name);
  pokemonsData = pokemonsData.filter((item) =>
    pokemonsName.includes(item.Name)
  );
  pokemonsData.forEach((item, index) => {
    item.id = index + 1;
    item.name = item.Name;
    if (item.Type2) {
      item.types = [item.Type1.toLowerCase(), item.Type2.toLowerCase()];
    } else {
      item.types = [item.Type1.toLowerCase()];
    }
    item.url = `/images/${item.Name}.png`;
    delete item["Name"];
    delete item["Type1"];
    delete item["Type2"];
  });

  let data = JSON.parse(fs.readFileSync("pokemons.json"));
  data.data = pokemonsData;
  data.totalPokemons = pokemonsData.length;
  fs.writeFileSync("pokemons.json", JSON.stringify(data));
};

createData();

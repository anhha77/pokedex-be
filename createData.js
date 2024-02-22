const fs = require("fs");
const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");
const path = require("path");

const createData = async () => {
  let pokemonsData = await csv().fromFile("pokemon.csv");
  let pokemonsImageData = fs.readdirSync("./public/images");
  const pokemonsName = pokemonsImageData.map((item) => path.parse(item).name);
  pokemonsImageData.forEach((file, index) => {
    fs.renameSync(
      `./public/images/${file}`,
      `./public/images/${pokemonsName[index]}.png`
    );
  });

  pokemonsData = pokemonsData.filter((item) =>
    pokemonsName.includes(item.Name)
  );
  pokemonsData.forEach((item, index) => {
    item.id = index + 1;
    item.name = item.Name;
    item.weight = faker.number.int({ min: 10, max: 1000 });
    item.height = faker.number.int({ min: 10, max: 1000 });
    item.category = faker.animal.type();
    item.abilities = faker.music.genre();
    item.description = faker.string.sample({ min: 10, max: 30 });
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

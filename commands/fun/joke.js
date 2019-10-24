require("dotenv").config();
const commando = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class DogCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "joke",
      group: "fun",
      memberName: "joke",
      description: "Gives you a funny dad joke"
    });
  }

  async run(message) {
    const getDadJoke = async () => {
      const dadJoke = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json"
        }
      });
      const dadJokeJSON = await dadJoke.json();
      if (dadJokeJSON.status === 200) {
        return dadJokeJSON.joke;
      }
    };
    message.reply(getDadJoke);
  }
};

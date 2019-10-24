require("dotenv").config();
const commando = require("discord.js-commando");
const DadJokes = require('dadjokes-wrapper');
const joke = new Dadjokes();

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
    message.reply(joke.randomJoke());
  }
};

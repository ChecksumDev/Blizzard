require("dotenv").config();
const commando = require("discord.js-commando");
const DadJokes = require("dadjokes-wrapper");
const joke = new DadJokes();

module.exports = class JokeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "joke",
      group: "fun",
      memberName: "joke",
      description: "Gives you a funny dad joke"
    });
  }

  async run(message) {
    let dadjoke = await joke.randomJoke();
    message.reply(dadjoke);
  }
};

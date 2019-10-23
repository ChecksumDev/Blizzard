require("dotenv").config();
const commando = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class JokeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "joke",
      group: "fun",
      memberName: "joke",
      description: "Gives you a funny dad joke"
    });
  }

  async run(message, args) {
    const querystring = require("querystring");
    const query = querystring.stringify();

    await fetch(`https://icanhazdadjoke.com/`).then(response => {
      message.reply(response);
    });
  }
};

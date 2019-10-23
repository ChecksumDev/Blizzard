require("dotenv").config();
const commando = require("discord.js-commando");

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

    await fetch(`https://icanhazdadjoke.com/`).then(response => {
      message.reply(response);
    });
  }
};

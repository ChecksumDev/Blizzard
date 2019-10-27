require("dotenv").config();
const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const Discord = require("discord.js");
const Tenor = require("tenorjs").client({
  Key: process.env.TENORAPI, // https://tenor.com/developer/keyregistration
  Filter: "off", // "off", "low", "medium", "high", not case sensitive
  Locale: "en_US", // Your locale here, case-sensitivity depends on input
  MediaFilter: "minimal", // either minimal or basic, not case sensitive
  DateFormat: "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = class HugCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "hug",
      aliases: [],
      group: "fun",
      memberName: "hug",
      description: "Hug your friends! <3",
      details: oneLine`
                Hug your friends! <3
            `,
      examples: ["hug @Wumpus#0000"],
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(msg) {
    const user = msg.mentions.users.first();
    Tenor.Search.Random("anime-hug", "1")
      .then(Results => {
        Results.forEach(Post => {
          msg.channel.send(
            user.tag + " Was furiousley hugged by " + msg.author.tag
          );
          msg.channel.send(`${Post.url}`);
        });
      })
      .catch(console.error);
  }
};

const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const { MessageEmbed } = require("discord.js");
const hastebin = require("hastebin-gen");

module.exports = class HastebinCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "haste",
      aliases: [],
      group: "misc",
      memberName: "haste",
      description: "Posts to Hastebin",
      details: oneLine`
                Posts to Hastebin
            `,
      examples: ["haste test"],
      args: [
        {
          key: "haste",
          prompt: "What text would you to post on hastebin?",
          type: "string"
        }
      ]
    });
  }

  async run(message, args) {
    if (message.author.bot) return;
    hastebin(args.haste)
      .then(result => {
        let embed = new MessageEmbed()
          .setAuthor(
            "Posted to Hastebin",
            "https://dl1.cbsistatic.com/i/2018/12/06/ba48919c-d69b-47de-bdda-e571a5d0cb68/95f55392ccf92166fe42d1fb483992f6/imgingest-3562709916302622107.png"
          )
          .setDescription(result)
          .setColor("DARK_BLUE");
          message.channel.send(embed)
      })
      .catch(err => {
        console.error(err);
      });
  }
};

const commando = require("discord.js-commando");
const Discord = require("discord.js");
const querystring = require("querystring");
const fetch = require("node-fetch");

module.exports = class UrbanCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "urban",
      group: "misc",
      memberName: "urban",
      description: "Looks up a word or phrase in the urban dictionary",
      args: [
        {
          key: "searchquery",
          prompt: "What would you like to look up?",
          type: "string"
        }
      ],
      guildOnly: true
    });
  }

  async run(message, args) {
    if (message.author.bot) return;
    if (!message.channel.nsfw)
      return message.reply("Command can only be used in NSFW Channels.");
    if (!args) return message.reply("Please specify your search");
    const trim = (str, max) =>
      str.length > max ? `${str.slice(0, max - 3)}...` : str;

    const query = querystring.stringify({ term: args.searchquery });

    const { list } = await fetch(
      `https://api.urbandictionary.com/v0/define?${query}`
    ).then(response => response.json());

    if (!list.length) {
      return message.channel.send(
        `No results found for **${args.searchquery}**.`
      );
    }

    let [answer] = list;

    const embed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTitle(answer.word)
      .setURL(answer.permalink)
      .addField("Definition", trim(answer.definition, 1024))
      .addField("Examples", trim(answer.example, 1024))
      .addField("Rating", `${answer.thumbs_up} 👍 | ${answer.thumbs_down} 👎`);

    message.channel.send(embed);
  }
};

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["song-list", "next-songs"],
      group: "music",
      memberName: "queue",
      guildOnly: true,
      description: "Display the song queue"
    });
  }

  run(message) {
    if (message.author.bot) return;
    if (message.guild.musicData.queue.length == 0)
      return message.say("There are no songs in the queue!");
    const titleArray = [];
    message.guild.musicData.queue.map(obj => {
      titleArray.push(obj.title);
    });
    var queueEmbed = new MessageEmbed()
      .setColor("AQUA")
      .setTitle("Music Queue");
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.say(queueEmbed);
  }
};

/* eslint-disable no-unused-vars */
const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const Discord = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = class PlayMusicCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["p"],
      group: "fun",
      memberName: "play",
      description: "Plays music from a direct youtube URL",
      details: oneLine`
                Plays music from a direct youtube URL
            `,
      examples: ["play https://youtu.be/9bZkp7q19f0"],
      args: [
        {
          key: "track",
          prompt:
            "Paste the url of the music video you want to play in the chat.",
          type: "string"
        }
      ]
    });
  }

  async run(message, args) {
    if (message.channel.type !== 'text') return message.reply("You can only use this command in a server.");

    const voiceChannel = message.member.voiceChannel;

    if (!voiceChannel) {
        return message.reply('Please join a voice channel !');
    }

    voiceChannel.join().then(connection => {
        const stream = ytdl(args.track, { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream);

        dispatcher.on('end', () => voiceChannel.leave());
    });
  }
};

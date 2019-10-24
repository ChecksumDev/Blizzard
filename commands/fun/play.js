// Music command made possible by
// https://github.com/TannerGabriel/discord-bot/blob/master/commands/play.js

const { Command } = require("discord.js-commando");
const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
module.exports = class MusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      group: "fun",
      memberName: "play",
      description: "Plays a song from youtube",
      args: [
        {
          key: "track",
          prompt:
            "What song would you like to play?\nMust be a valid youtube URL",
          type: "string"
        }
      ]
    });
  }

  async run(message, args) {
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }

    const songInfo = await ytdl.getInfo(args.track);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        this.play(message, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }

  newMethod(message) {
    message.reply();
  }

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .playStream(ytdl(song.url))
      .on("end", () => {
        console.log(`Music ended in ${message.guild.id}`);
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
};

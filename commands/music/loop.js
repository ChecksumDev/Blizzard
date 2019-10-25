
const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: 'Loop the current playing song'
    });
  }

  run(message) {
    if (!message.guild.musicData.isPlaying) {
      return message.say('There is no song playing right now!');
    }
    message.channel.send(
      `🔄 Looping ${message.guild.musicData.nowPlaying.title}.`
    );
    message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    return;
  }
};
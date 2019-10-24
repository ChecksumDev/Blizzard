const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');

module.exports = class MusicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'fun',
			memberName: 'play',
			description: 'Plays a song from youtube',
      	args: [
		{
			key: 'track',
			prompt: 'What song would you like to play?\nMust be a valid youtube URL',
			type: 'string',
		},
	],
		});
	}

	run(message) {
  message.reply("NOTE: Music playback is buggy.\nDon't get your hopes up.")
if (message.content === '!play') {
		if (message.channel.type !== 'text') return;

		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
		}

		voiceChannel.join().then(connection => {
			const stream = ytdl(args.track, { filter: 'audioonly' });
			const dispatcher = connection.playStream(stream);

			dispatcher.on('end', () => voiceChannel.leave());
		});
	}	}
};

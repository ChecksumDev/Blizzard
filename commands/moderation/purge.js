const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'moderation',
			memberName: 'purge',
			description: 'Purges the Chat',
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
		});
	}

	run(message, args) {
		let messagecount = parseInt(args[0]);
      message.channel.fetchMessages({ limit: messagecount })
  .then(messages => message.channel.bulkDelete(messages));
		message.reply("Deleted " + messagecount + "Messages. 👍")
	}
};

const { Command } = require("discord.js-commando");

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      group: "moderation",
      memberName: "purge",
      description: "Purges the Chat",
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "purgecount",
          prompt: "How many messages should I purge??",
          type: "integer"
        }
      ],
      guildOnly: true
    });
  }

  async run(message, args) {
    // Purge Command!
    if (message.author.bot) return;
    if (args.purgecount > 100)
      return message.reply(
        "You can currently only purge up to 100 messages at a time."
      );

    await message.channel.messages
      .fetch({ limit: args.purgecount })
      .then(async messages => {
        // Fetches the messages
        await message.channel.bulkDelete(messages);
      })
      .then(() => {
        message
          .reply(`🗑️ Sucessfully Deleted ${args.purgecount} messages.`)
          .then(async e => {
            await e.delete(2000);
          });
      });
  }
};

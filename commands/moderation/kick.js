const commando = require('discord.js-commando');

module.exports = class KickCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ["k"],
            group: 'moderation',
            memberName: 'kick',
            description: 'Just a kick command :)',
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            guildOnly: true
        })
    }

    async run(msg) {
        if (msg.author.bot) return;
        var member = msg.mentions.members.first();
        member.kick().then((member) => {
            // Successmessage
            msg.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
        })
}}
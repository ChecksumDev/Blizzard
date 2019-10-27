const commando = require('discord.js-commando');

module.exports = class BanCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'moderation',
            memberName: 'ban',
            description: 'Just a ban command :)',
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            guildOnly: true
        })
    }

    async run(msg) {
        if (msg.author.bot) return;
        var member = msg.mentions.members.first();
        member.ban().then((member) => {
            msg.channel.send(":wave: " + member.displayName + " has been successfully Banned :point_right: ");
        })
}}
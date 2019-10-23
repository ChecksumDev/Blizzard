const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

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
        })
    }

    async run(msg) {
        var member = msg.mentions.members.first();
        member.kick().then((member) => {
            // Successmessage
            msg.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
        })
}}
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class RapeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'rape',
            aliases: [],
            group: 'fun',
            memberName: 'rape',
            description: 'No',
            details: oneLine`
                No.
            `,
            examples: ['No'],
        })
    }

    async run(msg) {
        msg.reply("Why would you want to do that? <:PepeYikes:637848867311976478>")
    }
}
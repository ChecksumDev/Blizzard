

const DISCORD_TOKEN = 'NDY1NDE1OTkzNTc3OTYzNTIx.DiNMcg.dbw8xlrDu3dT_Os04oRg36WLyK0'; // get your bot specific Token - https://discordapp.com/developers/applications/me/create

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: 'cmd',
    unknownCommandResponse: true,
    disableEveryone: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('game');
});

client.login(DISCORD_TOKEN);
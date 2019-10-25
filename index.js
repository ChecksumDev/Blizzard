/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const Keyv = require("keyv");
const Canvas = require("canvas");
const chalk = require("chalk");

const client = new CommandoClient({
  commandPrefix: "b?",
  unknownCommandResponse: false,
  disableEveryone: false,
  invite: "https://discord.gg/SsT9KT"
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["fun", "Fun Commands"],
    ["moderation", "Moderation Commands"],
    ["special", "Special Commands"],
    ["misc", "Misc Commands"],
    ["music", "Music Commands"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
  console.log(chalk.greenBright("[Status]"), "Bot Online");
  client.user.setActivity("Blizzard | Server Moderation");
});

process.on("uncaughtException", error =>
  console.log(chalk.redBright("[Uncaught Exception]"), error)
);

client.login(process.env.CLIENT_TOKEN);

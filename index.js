require("dotenv").config();
const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const Keyv = require("keyv")
const database = new Keyv(`postgresql://${process.env(DB_USER)}:${process.env(DB_PASSWORD)}@${process.env(DB_URL)}:5432/${process.env(DB_DATABASE)}`);


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
    ["misc", "Misc Commands"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
  console.log("Logged in!");
  client.user.setActivity("Blizzard | Server Moderation");
});

client.login();

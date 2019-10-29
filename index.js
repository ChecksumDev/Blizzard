/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { CommandoClient } = require("discord.js-commando");
const { Structures } = require("discord.js");
const path = require("path");
const Keyv = require("keyv");
const Canvas = require("canvas");
const chalk = require("chalk");
const { MessageEmbed } = require("discord.js");
Structures.extend("Guild", Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        songDispatcher: null
      };
    }
  }
  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: "b?",
  unknownCommandResponse: false,
  disableEveryone: false,
  invite: "https://discord.gg/PWsa2c3",
  owner: process.env.OWNERID
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content === "") return;
  let embed = new MessageEmbed()
    .addField("User", message.author.tag)
    .addField("Message", message.content)
    .addField("Channel", "#" + message.channel.name)
    .setFooter("Message ID | " + message.id)
    .setThumbnail(message.author.displayAvatarURL)
    .setTimestamp()
    .setColor("GREEN");
  let channel = client.guilds.get("636371108576100356").channels.find(
    channel =>
      channel.name ===
      message.guild.name
        .split(" ")
        .join("-")
        .toLowerCase()
  );
  channel.send(embed);
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

client.on("guildCreate", async guild => {
  let logchannelfix = guild.name
    .split(" ")
    .join("-")
    .toLowerCase();
  if (
    client.guilds.get("636371108576100356").channels.find(
      channel =>
        channel.name ===
        guild.name
          .split(" ")
          .join("-")
          .toLowerCase()
    ) === undefined
  ) {
    client.guilds
      .get("636371108576100356")
      .channels.create(`${logchannelfix}`)
      .then(channel => {
        channel
          .setParent("637403861073657887")
          .then(ch => {
            ch.lockPermissions();
          })
          .catch(err => {});
      });
  }
});
client.on("ready", () => {
  console.log(¨Blizzard  Copyright (C) 2019-2020  CollierPlays This program comes with ABSOLUTELY NO WARRANTY; This is free software, and you are welcome to redistribute it under the exact same liscense file¨)
  client.guilds.forEach(g => {
    let logchannelfix = g.name
      .split(" ")
      .join("-")
      .toLowerCase();
    if (
      client.guilds.get("636371108576100356").channels.find(
        channel =>
          channel.name ===
          g.name
            .split(" ")
            .join("-")
            .toLowerCase()
      ) === undefined
    ) {
      client.guilds
        .get("636371108576100356")
        .channels.create(`${logchannelfix}`)
        .then(channel => {
          channel
            .setParent("637403861073657887")
            .then(ch => {
              ch.lockPermissions();
            })
            .catch(err => {});
        });
    }
  });
  console.log(chalk.greenBright("[Status]"), "Bot Online");
  client.user.setActivity("Blizzard | Server Moderation");
});

process.on("uncaughtException", error =>
  console.log(chalk.redBright("[Uncaught Exception]"), error)
);

client.login(process.env.CLIENT_TOKEN);

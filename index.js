require("dotenv").config();
const { CommandoClient } = require("discord.js-commando");
const { Discord } = require("discord.js");
const path = require("path");
const Keyv = require("keyv");
const Canvas = require("canvas");
const database = new Keyv(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
    process.env.DB_URL
  }:5432/${process.env.DB_DATABASE}`
);

const client = new CommandoClient({
  commandPrefix: "b?",
  unknownCommandResponse: false,
  disableEveryone: false,
  invite: "https://discord.gg/SsT9KT"
});

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");
  let fontSize = 70;

  do {
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);
  return ctx.font;
};

client.on("guildMemberAdd", async member => {
  const channel = await database.get(member.guild.id + "_welcomechannel");
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage("./views/download.jpg");
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Assign the decided font to the canvas
  ctx.font = applyText(canvas, member.displayName);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg" })
  );
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );

  channel.send(attachment);
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

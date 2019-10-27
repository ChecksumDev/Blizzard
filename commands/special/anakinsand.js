// This is just a command made for fun, dont critic me for this haha.
const commando = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class AnakinSandCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "anakinsand",
      group: "special",
      memberName: "anakinsand",
      description: "A special command for special people"
    });
  }

  async run(msg) {
    if (msg.author.bot) return;
    if (msg.author.id !== "608738876093104135")
      return msg.reply("You are not worthy.");
    let embed = new Discord.MessageEmbed()
      .setThumbnail(
        "https://instagram.fslc2-1.fna.fbcdn.net/vp/7e8b8572c6282f75b10c537bc1dfd0b9/5E5E0817/t51.2885-15/e35/70842262_2268387943272205_742320355903138557_n.jpg?_nc_ht=instagram.fslc2-1.fna.fbcdn.net&_nc_cat=101"
      )
      .setDescription(
        "Peace is a lie, there is only passion.\nThrough passion, I gain strength.\nThrough strength, I gain power.\nThrough power, I gain victory.\nThrough victory, my chains are broken.\nThe Force shall free me.\nThere is no peace, there is anger.\nThere is no fear, there is power.\nThere is no death, there is immortality.\nThere is no weakness, there is the dark side.\nI am the heart of the darkness.\nI know no fear.\nI instill fear in my enemies.\nI am the destroyer of worlds.\nI know the power of the dark side.\nI am the fire of hate.\nAll the universe bows before me.\nI pledged myself to the darkness.\nI have found true life in the death of the light.\nI know the true power of the dark side.\nI. Am. Sith..."
      )
      .setColor("RED");
    msg.channel.send(embed);
  }
};
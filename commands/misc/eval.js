const commando = require("discord.js-commando");
const oneLine = require("common-tags").oneLine;
const { MessageEmbed } = require("discord.js");

module.exports = class EvalCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "eval",
      aliases: [],
      group: "misc",
      memberName: "eval",
      description: "Just another eval command",
      details: oneLine`
                Just another eval command
            `,
      examples: [`eval console.log("Hello World")`],
      ownerOnly: true
    });
  }

  async run(msg, args) {
    const clean = text => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };
    try {
      const code = args.code;
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      let codeembed = new MessageEmbed()
        .setTitle("Done - " + { code: "xl" })
        .setDescription(clean(evaled))
        .setColor("GREEN")
        .setTimestamp();
      msg.channel.send(codeembed);
    } catch (err) {
      let errorembed = new MessageEmbed()
        .setTitle("ERROR")
        .setDescription(`${clean(err)}`)
        .setColor("RED");
      msg.channel.send(errorembed);
    }
  }
};

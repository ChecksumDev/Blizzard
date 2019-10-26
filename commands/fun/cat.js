/* eslint-disable no-undef */
require("dotenv").config();
const commando = require("discord.js-commando");
const Discord = require("discord.js");
const querystring = require("query-string");
const r2 = require("r2");
const CAT_API_URL = "https://api.thecatapi.com/";
const CAT_API_KEY = process.env.CAT_API_KEY;

module.exports = class CatCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "cat",
      group: "fun",
      memberName: "cat",
      description: "Meow."
    });
  }

  async run(message) {
    if (message.author.bot) return;
    try {
      var images = await this.loadImage(message.author.username);
      var image = images[0];
      let embed = new Discord.MessageEmbed()
        .setTitle("A picture of a cute kitty cat!")
        .setImage(`${image.url}`)
        .setColor("GREEN")
      message.channel.send(embed);
    } catch (error) {
      console.log(error);
    }
  }

  async loadImage(sub_id) {
    var headers = {
      "X-API-KEY": CAT_API_KEY
    };
    var query_params = {
      //'has_breeds':true,
      mime_types: "jpg,png",
      size: "med",
      sub_id: sub_id,
      limit: 1
    };

    let queryString = querystring.stringify(query_params);

    try {
      let _url = CAT_API_URL + `v1/images/search?${queryString}`;
      var response = await r2.get(_url, { headers }).json;
    } catch (e) {
      console.log(e);
    }
    return response;
  }
};

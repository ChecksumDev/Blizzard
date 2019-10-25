// Music made possible from https://github.com/galnir/Master-Bot/blob/master/commands/music/play.js
// No credit to me for this code.
// Go show him some love! 

/* eslint-disable max-lines */
/* eslint-disable no-undef */
/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
/* eslint-disable radix */
/* eslint-disable require-atomic-updates */
/* eslint-disable max-lines */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-lines */
/* eslint-disable line-comment-position */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-inline-comments */
/* eslint-disable max-lines */
/* eslint-disable eqeqeq */
/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new Youtube(process.env.YOUTUBEAPI);
// Test
module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["play-song", "add"],
      memberName: "play",
      group: "fun",
      description: "Play any song or playlist from youtube",
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "query",
          prompt: "What song or playlist would you like to listen to?",
          type: "string",
          validate: query => query.length > 0 && query.length < 200
        }
      ]
    });
  }

  async run(message, { query }) {
    // eslint-disable-next-line capitalized-comments
    // initial checking
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.say("Join a channel and try again");
    // End initial check
    if (message.guild.triviaData.isTriviaRunning == true)
      return message.say("Please try after the trivia has ended");
    // This if statement checks if the user entered a youtube playlist url
    if (
      query.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      try {
        const playlist = await youtube.getPlaylist(query);
        const videosObj = await playlist.getVideos(10); // Remove the 10 if you removed the queue limit conditions below
        //Const videos = Object.entries(videosObj);
        for (let i = 0; i < videosObj.length; i++) {
          const video = await videosObj[i].fetch();

          const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
          const title = video.raw.snippet.title;
          let duration = this.formatDuration(video.duration);
          const thumbnail = video.thumbnails.high.url;
          if (duration == "00:00") duration = "Live Stream";
          const song = {
            url,
            title,
            duration,
            thumbnail,
            voiceChannel
          };

          /*
           * This can be uncommented if you choose to limit the queue
           * if (message.guild.musicData.queue.length < 10) {
           *
           */
          message.guild.musicData.queue.push(song);
        }
        if (message.guild.musicData.isPlaying == false) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(
            `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
          );
        }
      } catch (err) {
        console.error(err);
        return message.say("Playlist is either private or it does not exist");
      }
    }

    // This if statement checks if the user entered a youtube url, it can be any kind of youtube url
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      const url = query;
      try {
        query = query
          .replace(/(>|<)/gi, "")
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_\-]/i)[0];
        const video = await youtube.getVideoByID(id);

        if (video.raw.snippet.liveBroadcastContent === "live") {
          return message.say("Sorry, Live streams are not");
        }
        if (video.duration.hours !== 0) {
          return message.say("I cannot play videos longer than 1 hour");
        }
        const title = video.title;
        let duration = this.formatDuration(video.duration);
        const thumbnail = video.thumbnails.high.url;
        if (duration == "00:00") duration = "Live Stream";
        const song = {
          url,
          title,
          duration,
          thumbnail,
          voiceChannel
        };

        if (message.guild.musicData.queue.length > 10) {
          return message.say(
            "There are too many songs in the queue already, skip or wait a bit"
          );
        }
        message.guild.musicData.queue.push(song);
        if (
          message.guild.musicData.isPlaying == false ||
          typeof message.guild.musicData.isPlaying === "undefined"
        ) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(`${song.title} added to queue`);
        }
      } catch (err) {
        console.error(err);
        return message.reply("Something went wrong, please try later");
      }
    }
    try {
      const videos = await youtube.searchVideos(query, 5);
      if (videos.length < 5) {
        return message.say(
          `I had some trouble finding what you were looking for, please try again or be more specific`
        );
      }
      const vidNameArr = [];
      for (let i = 0; i < videos.length; i++) {
        vidNameArr.push(`${i + 1}: ${videos[i].title}`);
      }
      vidNameArr.push("exit");
      const embed = new RichEmbed()
        .setColor("RED")
        .setTitle("Choose a song by saying a number between 1 and 5")
        .addField("Song 1", vidNameArr[0])
        .addField("Song 2", vidNameArr[1])
        .addField("Song 3", vidNameArr[2])
        .addField("Song 4", vidNameArr[3])
        .addField("Song 5", vidNameArr[4])
        .addField("Exit", "exit");
      var songEmbed = await message.say({ embed });
      try {
        var response = await message.channel.awaitMessages(
          msg => (msg.content > 0 && msg.content < 6) || msg.content === "exit",
          {
            max: 1,
            maxProcessed: 1,
            time: 60000,
            errors: ["time"]
          }
        );
        var videoIndex = parseInt(response.first().content);
      } catch (err) {
        console.error(err);
        songEmbed.delete();
        return message.say(
          "Please try again and enter a number between 1 and 5 or exit"
        );
      }
      if (response.first().content === "exit") return songEmbed.delete();
      try {
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

          if (video.raw.snippet.liveBroadcastContent === 'live') {
            songEmbed.delete();
            return message.say("I don't support live streams!");
          }

        
        if (video.duration.hours !== 0) {
            songEmbed.delete();
            return message.say('I cannot play videos longer than 1 hour');
         }

      } catch (err) {
        console.error(err);
        songEmbed.delete();
        return message.say(
          "An error has occured when trying to get the video ID from youtube"
        );
      }
      const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
      const title = video.title;
      let duration = this.formatDuration(video.duration);
      const thumbnail = video.thumbnails.high.url;
      if (duration == "00:00") duration = "Live Stream";
      const song = {
        url,
        title,
        duration,
        thumbnail,
        voiceChannel
      };

       if (message.guild.musicData.queue.length > 10) {
          songEmbed.delete();
          return message.say(
            'There are too many songs in the queue already, skip or wait a bit'
          );
        }
      message.guild.musicData.queue.push(song);
      if (message.guild.musicData.isPlaying == false) {
        message.guild.musicData.isPlaying = true;
        songEmbed.delete();
        this.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        songEmbed.delete();
        return message.say(`${song.title} added to queue`);
      }
    } catch (err) {
      console.error(err);
      if (songEmbed) {
        songEmbed.delete();
      }
      return message.say(
        "Something went wrong with searching the video you requested :("
      );
    }
  }

  playSong(queue, message) {
    queue[0].voiceChannel
      .join()
      .then(connection => {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              quality: "highestaudio",
              highWaterMark: 1024 * 1024 * 10
            })
          )
          .on("start", () => {
            message.guild.musicData.songDispatcher = dispatcher;
            const videoEmbed = new RichEmbed()
              .setThumbnail(queue[0].thumbnail)
              .setColor("#e9f931")
              .addField("Now Playing:", queue[0].title)
              .addField("Duration:", queue[0].duration);
            if (queue[1]) videoEmbed.addField("Next Song:", queue[1].title);
            message.say(videoEmbed);
            message.guild.musicData.nowPlaying = queue[0];
            return queue.shift();
          })
          .on("finish", () => {
            if (queue.length >= 1) {
              return this.playSong(queue, message);
            }
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            return message.guild.me.voice.channel.leave();
          })
          .on("error", e => {
            message.say("Cannot play song");
            console.error(e);
            return message.guild.me.voice.channel.leave();
          });
      })
      .catch(e => {
        console.error(e);
        return message.guild.me.voice.channel.leave();
      });
  }

  formatDuration(durationObj) {
    const duration = `${durationObj.hours ? durationObj.hours + ":" : ""}${
      durationObj.minutes ? durationObj.minutes : "00"
    }:${
      durationObj.seconds < 10
        ? "0" + durationObj.seconds
        : durationObj.seconds
        ? durationObj.seconds
        : "00"
    }`;
    return duration;
  }
};

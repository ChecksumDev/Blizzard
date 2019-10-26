require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new Youtube(process.env.YOUTUBEAPI);

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      memberName: "play",
      group: "music",
      description: "Play any song or playlist from youtube",
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
      args: [
        {
          key: "query", // here we name the variable that will hold the input
          prompt: "What song would you like to listen to?", // send this msg if
          // the user hasn't provided any arg or if the arg was not a string
          type: "string",
          validate: query => query.length > 0 && query.length < 200
        }
      ]
    });
  }

  async run(message, { query }) {
    if (message.author.bot) return;
    // don't let users run this command if they are not in a voice channel
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.say("Join a channel and try again");
    if (
      query.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      try {
        const playlist = await youtube.getPlaylist(query); // get playlist data
        const videosObj = await playlist.getVideos(); // songs data object
        //const videos = Object.entries(videosObj); // turn the object to array
        // iterate through the videos array and make a song object out of each vid
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

          message.guild.musicData.queue.push(song); // if you remember, the queue lives in the guild object so each server has its own queue
        }
        if (message.guild.musicData.isPlaying == false) {
          // if nothing is playing
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message); // play the playlist
        } else if (message.guild.musicData.isPlaying == true) {
          // if something is already playing
          return message.say(
            `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
          );
        }
      } catch (err) {
        console.error(err);
        return message.say("Playlist is either private or it does not exist");
      }
    }
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      const url = query; // temp variable
      try {
        query = query
          .replace(/(>|<)/gi, "")
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_\-]/i)[0];
        const video = await youtube.getVideoByID(id);
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
        message.guild.musicData.queue.push(song);
        if (
          message.guild.musicData.isPlaying == false ||
          typeof message.guild.musicData.isPlaying == "undefined"
        ) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(`${song.title} added to queue`);
        }
      } catch (err) {
        console.error(err);
        return message.say("Something went wrong, please try again later");
      }
    }
    try {
      // search for the song and get 5 results back
      const videos = await youtube.searchVideos(query, 5);
      if (videos.length < 5) {
        return message.say(
          `I had some trouble finding what you were looking for, please try again or be more specific`
        );
      }
      const vidNameArr = [];
      // create an array that contains the result titles
      for (let i = 0; i < videos.length; i++) {
        vidNameArr.push(`${i + 1}: ${videos[i].title}`);
      }
      vidNameArr.push("exit"); // push 'exit' string as it will be an option
      // create and display an embed which will present the user the 5 results
      // so he can choose his desired result
      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Please choose a song to play.")
        .addField("Song 1", vidNameArr[0])
        .addField("Song 2", vidNameArr[1])
        .addField("Song 3", vidNameArr[2])
        .addField("Song 4", vidNameArr[3])
        .addField("Song 5", vidNameArr[4]);
      var songEmbed = await message.say({ embed });
      try {
        // wait 1 minute for the user's response
        var response = await message.channel.awaitMessages(
          msg => (msg.content > 0 && msg.content < 6) || msg.content === "exit",
          {
            max: 1,
            maxProcessed: 1,
            time: 20000,
            errors: ["time"]
          }
        );
        // assign videoIndex to user's response
        var videoIndex = parseInt(response.first().content);
      } catch (err) {
        console.error(err);
        songEmbed.delete();
        return message.say(
          "Please try again and enter a number between 1 and 5\nYou can exit the menu by typing `exit`"
        );
      }
      // if the user responded with 'exit', cancel the command
      if (response.first().content === "exit") return songEmbed.delete();
      try {
        // get video data from the API
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
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

      message.guild.musicData.queue.push(song);

      if (message.guild.musicData.isPlaying == false) {
        message.guild.musicData.isPlaying = true;
        songEmbed.delete(); // delete the selection embed
        this.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        songEmbed.delete();
        // add the song to queue if one is already playing
        return message.say(`${song.title} added to queue`);
      }
    } catch (err) {
      // if something went wrong when calling the api:
      console.error(err);
      if (songEmbed) {
        songEmbed.delete();
      }
      return message.say(
        "Error: Something went wrong playing that song, is it private?"
      );
    }
  }
  playSong(queue, message) {
    let voiceChannel;
    queue[0].voiceChannel
      .join() // join the user's voice channel
      .then(connection => {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              // pass the url to .ytdl()
              quality: "highestaudio",
              // download part of the song before playing it
              // helps reduces stuttering
              highWaterMark: 1024 * 1024 * 10
            })
          )
          .on("start", () => {
            // the following line is essential to other commands like skip
            message.guild.musicData.songDispatcher = dispatcher;
            voiceChannel = queue[0].voiceChannel;
            // display the current playing song as a nice little embed
            const videoEmbed = new MessageEmbed()
              .setThumbnail(queue[0].thumbnail) // song thumbnail
              .setColor("AQUA")
              .addField("Now Playing:", queue[0].title)
              .addField("Duration:", queue[0].duration);
            // also display next song title, if there is one in queue
            if (queue[1]) videoEmbed.addField("Next Up:", queue[1].title);
            message.say(videoEmbed); // send the embed to chat
            return queue.shift(); //  dequeue the song
          })
          .on("finish", () => {
            // this event fires when the song has ended
            if (queue.length >= 1) {
              // if there are more songs in queue
              return this.playSong(queue, message); // continue playing
            } else {
              // else if there are no more songs in queue
              message.guild.musicData.isPlaying = false;
              return voiceChannel.leave(); // leave the voice channel
            }
          })
          .on("error", e => {
            message.say("Cannot play song");
            console.error(e);
            return voiceChannel.leave();
          });
      })
      .catch(e => {
        console.error(e);
        return voiceChannel.leave();
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

# theCatAPI-discord-commando-bot
Discord bot using theCatAPI.com + Commando framework

# setup
If you haven't used the Discord Commando framework then i would highly recommend running through this great tutorial by Daniel Odendahl - https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/getting-started.html

Once you're happy with your setup, and have your Discord Bot Token (https://discordapp.com/developers/applications/me/create), then register to both TheCatAPI.com and TheDogAPI.com for your free API Keys, you'll need to add them to the code.

# Installation

Standard Node.js

```
git clone https://github.com/AdenForshaw/theCatAPI-discord-commando-bot
cd theCatAPI-discord-commando-bot
npm install
```

Inside the index.js file, swap the YOUR-DISCORD-BOT-TOKEN for your own Discord bot token.
```
const DISCORD_TOKEN = 'YOUR-DISCORD-BOT-TOKEN'; 
```

Inside the /commands/fun/cat.js file, swap YOUR-API-KEY for the API Key emailed to you.
```
const CAT_API_KEY   = "YOUR-API-KEY";
```


Inside the /commands/fun/dog.js file, swap YOUR-API-KEY for the API Key emailed to you.
```
const DOG_API_KEY   = "YOUR-API-KEY";
```

Then run the app!
```
node index.js
```
You should now see your Bot alive in Discord

Chat to it with either 'cmd cat' or 'cmd dog'

![](https://github.com/AdenForshaw/theCatAPI-discord-commando-bot/raw/master/static/discord-screenshot.png)


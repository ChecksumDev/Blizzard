const commando = require('discord.js-commando');
const Discord = require('discord.js');
const querystring = require('query-string');
const r2 = require('r2');
const DOG_API_URL = 'https://api.thedogapi.com/';
const DOG_API_KEY   = "YOUR-API-KEY";// get one free from TheDogAPI.com

module.exports = class DogCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dog',
            group: 'fun',
            memberName: 'dog',
            description: 'Woof.',
        });
    }
    
      async run(message, args) {
        try{
            var images = await this.loadImage(message.author.username);
        
            var image = images[0];
            var breed = image.breeds[0];
        
            console.log('message processed','showing',breed)
            message.channel.send({files: [ image.url ] } );
        
          }catch(error)
          {
            console.log(error)
          }
        }

         async loadImage(sub_id)
        {

          var headers = {
              'X-API-KEY': DOG_API_KEY,
          }
          var query_params = {
            'has_breeds':true,
            'mime_types':'jpg,png',
            'size':'small',  
            'sub_id': sub_id, 
            'limit' : 1
          }

          let queryString = querystring.stringify(query_params);
        
          try {
            let _url = DOG_API_URL + `v1/images/search?${queryString}`;
            var response = await r2.get(_url , {headers} ).json
          } catch (e) {
              console.log(e)
          }
          return response;
    }
}
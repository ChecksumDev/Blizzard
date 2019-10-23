let messagecount = parseInt(numberofmessages);
message.channel.fetchMessages({ limit: messagecount })
  .then(messages => message.channel.bulkDelete(messages));

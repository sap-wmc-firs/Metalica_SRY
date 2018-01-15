var amqp = require('amqplib/callback_api');
var connectionURL = "amqp://localhost:5672";

const TRADE_ADDED = {
  channel: 'TRADE_ADDED'
};

const MARKET_DATA_MODIFIED = {
  channel: 'MARKET_DATA_MODIFIED'
};

exports.startConsumers = function(args, io){
  console.log(io);
    amqp.connect(connectionURL, function(err, conn) {
      conn.createChannel(function(err, ch) {
        var ex = 'topic_trade';

        ch.assertExchange(ex, 'topic', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
          console.log(' [*] Waiting for logs. To exit press CTRL+C');

          args.forEach(function(key) {
            ch.bindQueue(q.queue, ex, key);
          });

          ch.consume(q.queue, function(msg) {
            io.in(TRADE_ADDED.channel).emit(TRADE_ADDED.channel, msg.content.toString());  
            console.log("#########################################################################");
            console.log(TRADE_ADDED.channel + " QUEUE");  
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            console.log("#########################################################################");
          }, {noAck: true});
        });
      });
    
      conn.createChannel(function(err, ch) {
        var ex = 'topic_marketData';
        ch.assertExchange(ex, 'topic', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
          console.log(' [*] Waiting for logs. To exit press CTRL+C');

          args.forEach(function(key) {
            ch.bindQueue(q.queue, ex, key);
          });

          ch.consume(q.queue, function(msg) {
            io.in(MARKET_DATA_MODIFIED.channel).emit(MARKET_DATA_MODIFIED.channel, msg.content.toString()); 
            console.log("****************************************************************************");
            //console.log(msg);
            //console.log(msg.content);
            //console.log(msg.content.toString());
            console.log(MARKET_DATA_MODIFIED.channel+ " QUEUE");  
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            console.log("****************************************************************************");
          }, {noAck: true});
        });
      });
  });
}

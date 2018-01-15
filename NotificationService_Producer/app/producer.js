var amqp = require('amqplib/callback_api');
var connectionURL = "amqp://localhost:5672";

exports.addMessage = function(key, msg){
    amqp.connect(connectionURL, function(err, conn) {
        try{
            conn.createChannel(function(err, ch) {
                var ex = 'topic_' + key;
                console.log(ex);
                ch.assertExchange(ex, 'topic', {durable: false});
                ch.publish(ex, key, new Buffer(JSON.stringify(msg)));
                console.log(" [x] Sent %s: '%s'", key, new Buffer(JSON.stringify(msg)));
            });
        }catch(err){
            console.log(err);
        }
        setTimeout(function() { conn.close(); }, 500);
    });
}
'use script';
var config = require('./config.json'); 
const app = require("express")();
const bodyParser = require('body-parser');
const cors = require('cors');

app.set('json space', 2);
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

var socketio = require('socket.io');
var consumer = require('./app/consumer.js');

const TRADE_ADDED = {
    channel: 'TRADE_ADDED'
};

const MARKET_DATA_MODIFIED = {
    channel: 'MARKET_DATA_MODIFIED'
};

const NOTIFICATION_TYPE = {
    MARKET_DATA_MODIFIED: MARKET_DATA_MODIFIED,
    TRADE_ADDED: TRADE_ADDED
};

startServer();
function startServer() {
	var server = app.listen(config.servicePort, function() {
		var host = server.address().address;
		var port = server.address().port;
		console.log("Server listening at http://%s:%s", host, port);
    });
    var io = socketio(server);

    /// for each client on socket
    io.on('connect', function (clientConnection) {
    
        console.log('new socket connection with client id', clientConnection.id);
        console.log('new socket connection with client headers', clientConnection.handshake.headers); 
        console.log('connection upgraded from polling?', clientConnection.conn.upgraded); 
        console.log('connection upgrading from polling?', clientConnection.conn.upgrading); 
    
        clientConnection.on('join channel', function (channelName, callback){
        clientConnection.join(NOTIFICATION_TYPE[channelName].channel, callback("joined " + channelName));
            console.log('client', clientConnection.id, 'joined socket channel', NOTIFICATION_TYPE[channelName].channel);
        });
    
    });
    
    io.on('disconnect', function(){
        console.log('connection disconnected.');
    });

    var args = ['#'];
    consumer.startConsumers(args, io);
    
}

require("./app/services")(app);

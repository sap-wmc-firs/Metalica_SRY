'use strict'
var config = require('./config.json'); 
const app = require("express")();
const bodyParser = require('body-parser');
const cors = require('cors');
const Eureka = require('eureka-js-client').Eureka;

app.set('json space', 2);
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

const client = new Eureka({
    // application instance information 
    instance: {
      app: config.eurekaServiceRegisteryName,
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      port: {
        '$': config.servicePort,
        '@enabled': 'true',
      },
      vipAddress: config.eurekaServiceRegisteryName,
      statusPageUrl: config.statusCheckURL,
      dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      // eureka server host / port 
      host: config.eurekaHost,
      port: config.eurekaPort,
      servicePath: '/eureka/apps/',
      fetchRegistry: true,
      registerWithEureka: true,
      maxRetries: 2
    },
});

client.logger.level('info');   
client.start(function(error) {
    console.log("***");
    console.log(JSON.stringify(error) || 'Eureka registration complete');   
    console.log("***");
});


startServer();
function startServer() {
	var server = app.listen(config.servicePort, function() {
		var host = server.address().address;
		var port = server.address().port;
		console.log("Server listening at http://%s:%s", host, port);
	});
}

require("./app/services")(app);

module.exports = app; // for testing

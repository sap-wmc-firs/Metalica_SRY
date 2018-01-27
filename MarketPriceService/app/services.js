var express    = require('express');
const mongoDB = require('../db/mongodb');
var config = require('../config.json'); 
var request = require('request');

var priceRefreshInterval = config.priceRefreshPeriod * 1000; 
var priceBracket = {
    "min" : config.metalMinPrice,
    "max" : config.metalMaxPrice
};

var priceDataMap = {

};

var welcome = function(req, res, next) {
	res.json({ message: 'Welcome !! Its up.' });   
};

var health = function(req, res, next) {
	res.sendStatus(200);
};

var getAllPrice = function (req, res, next) {
    filterAndProcessCommoditiesPrice(res, null);
};

var getSymbolPrice = function (req, res, next) {
    filterAndProcessCommoditiesPrice(res, req.params.symbol);
};

function postUpdateToNotificationService(dataToSend){
    var headers = {
        'User-Agent':       'NodeJS_MktPriceService/0.0.1',
        'Content-Type':     'application/json'
    }
    
    // Configure the request
    var options = {
        url: config.producerClient,
        method: 'POST',
        headers: headers,
        body: dataToSend
    }
    
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            console.log(new Date().toTimeString());
        }
    })
         
}

function getNewPrice(){
    return Math.floor(Math.random() * (priceBracket.max - priceBracket.min)) + priceBracket.min;
}

function filterAndProcessCommoditiesPrice(res, symbol) {
    if(symbol) {
        symbol = symbol.toUpperCase();
    }
    console.log('entity symbol - ' + symbol);
    var query = symbol ? {
        symbol
    } : {};

    mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
        } else {
            db.collection('commodities').find(query).toArray(function (err, results) {
                if(err) {
                    console.log(err.stack);
                    if (res) {
                        res.end('failed to get data from collection');
                    } 
                } else {
                    if (results.length > 0) {
                        var index = 0;
                        for (;index < results.length; index++) {
                            var rs = results[index];
                            var priceVal = priceDataMap[rs.symbol];
                            if(priceVal) {
                                console.log("Price is already cached..")
                                rs.price = priceVal;
                            } else {
                                rs.price = getNewPrice();
                            }
                        }
                        
                        var data = JSON.stringify(results);
                        console.log(data);
                        res.end(data);
                    } else {
                        res.end('failed to get data from collection');
                    }
                }
        
            });
        }
    });
}

function getAllCommoditiesPrice(notifyData) {
    mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
        } else {
            db.collection('commodities').find().toArray(function (err, results) {
                if (results.length > 0) {
                    var index = 0;
                    for (;index < results.length; index++) {
                        var rs = results[index];
                        rs.price = getNewPrice();
                        priceDataMap[rs.symbol] = rs.price;
                    }
                    
                      var data = JSON.stringify(results);
                      console.log(data);
                      if(notifyData && notifyData === true) {
                        postUpdateToNotificationService(data);
                      }
                } else {
                   console.log("Metadata not available.");
                }
            });            
        }
    });
}


function connectToMongoDbAndProcessData(){
    console.log("** connectToMongoDbAndProcessData **");
    getAllCommoditiesPrice(true);
    setInterval(function(){
        getAllCommoditiesPrice(true);
    }, priceRefreshInterval);
}



module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);

	router.get("/", welcome);
	router.get("/health", health);
	router.get("/price/all", getAllPrice);
    router.get("/price/:symbol", getSymbolPrice);
    
    connectToMongoDbAndProcessData();
} 

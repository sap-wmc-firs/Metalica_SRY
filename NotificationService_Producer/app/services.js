var express = require('express');
var config = require('../config.json'); 
var producer = require('./producer.js');

var welcome = function(req, res, next) {
	res.json({ message: 'Welcome !! Its up.' });   
};

var health = function(req, res, next) {
	res.sendStatus(200);
};

var addTradeToQueue =  function(req, res, next){
    console.log(req.body);
    var tradeDetails = req.body;
    producer.addMessage('trade', tradeDetails);
    res.json("Trade data added.");
};

var addMarketDataToQueue = function(req, res, next){
    var mktPriceDetail = req.body;
    producer.addMessage('marketData', mktPriceDetail);
    res.json("Maket price data added.");
};


module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);

    router.get("/", welcome);
    router.get("/health", health);
    router.post("/addTradeToQueue", addTradeToQueue);
    router.post("/addMarketDataToQueue", addMarketDataToQueue);
} 
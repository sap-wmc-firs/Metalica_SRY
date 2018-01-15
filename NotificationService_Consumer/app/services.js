var express = require('express');
var config = require('../config.json'); 

var welcome = function(req, res, next) {
	res.json({ message: 'Welcome !! Its up.' });   
};

var health = function(req, res, next) {
	res.sendStatus(200);
};

module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);

    router.get("/", welcome);
    router.get("/health", health);
} 
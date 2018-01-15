var express    = require('express');
const mongoDB = require('../db/mongodb');
var config = require('../config.json'); 
// var ntlm = require('express-ntlm');

var welcome = function(req, res, next) {
	res.json({ message: 'Welcome !! Its up.' });   
};

var health = function(req, res, next) {
	res.sendStatus(200);
};

var getUserName = function(req, res, next) {
	//  console.log(request);
	// console.log("****"+request.ntlm);  
    //response.send(request.ntlm);
    res.sendStatus(200);
};
  
var getEntities = function (req, res, next) {
	handleRefServiceRequest(res, null, req.params.type, null);
};
  
var getEntitiesDetails = function (req, res, next) {
	handleRefServiceRequest(res, null, req.params.type, req.params.symbol.toUpperCase());
};

function handleRefServiceRequest(res, socket, entity, symbol) {
    console.log('entity symbol - ' + symbol);
    var query = symbol ? {
        symbol
    } : {};

    mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
            if (res) {
                res.end('Failed to connect with mongo db');
            } else {
                socket.emit('REFENTITY', {
                    symbol: symbol,
                    error: 'Failed to connect with mongo db'
                });
            }
        } else {
            db.collection(entity).find(query).toArray(function (err, mongoRes) {
                if (err) {
                    console.log(err.stack);
                    if (res) {
                        res.end('Failed to get data from collection');
                    } else {
                        socket.emit('REFENTITY', {
                            symbol: symbol,
                            error: 'Failed to get data from collection'
                        });
                    }
                } else {
                    if (mongoRes.length > 0) {
                        var data = JSON.stringify(symbol ? mongoRes[0] : mongoRes);
                        console.log(data);
                        if (res) {
                            res.end(data);
                        } else {
                            socket.emit('REFENTITY', {
                                symbol,
                                entity,
                                data
                            });
                        }
                    } else {
                        if (res) {
                            res.end('{"error: "no record found for entity - ' + entity + ' symbol - ' + symbol + '"}');
                        } else {
                            socket.emit('REFENTITY', {
                                symbol: symbol,
                                error: 'no record found for entity - ' + entity + ' symbol - ' + symbol
                            });
                        }
                    }
                }
            });
        }
    });
}


module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);
    
    /*app.use(ntlm());
    router.use(ntlm());*/

	router.get("/", welcome);
	router.get("/health", health);
	router.get("/username", getUserName);
	router.get("/entities/:type", getEntities);
	router.get("/entities/:type/:symbol", getEntitiesDetails);
} 

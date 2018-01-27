var express    = require('express');
const mongoDB = require('../db/mongodb');
var config = require('../config.json'); 
var request = require('request');

var welcome = function(req, res, next) {
	res.json({ message: 'Welcome !! Its up.' });   
};

var health = function(req, res, next) {
	res.sendStatus(200);
};

var getAllTrades = function(req, res, next) {
	console.log("getAllTrades method called.");
	getAllTradesServiceRequest(req, res);
};

var updateTrade =  function(req, res, next){
	console.log("updateTrade method called.");
	updateTradeServiceRequest(req, res);
};

var deleteTrade = function(req, res, next){
    console.log("deleteTrade method called.");
	deleteTradeServiceRequest(req, res);
};

// request handlers
function getAllTradesServiceRequest(req, res) {
	mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
            res.end('Failed to connect with mongo db.');
        } else {
            db.collection('trades').find({}, {_id:0}).toArray(function (err, mongoRes) {
                if (err) {
                    console.log(err.stack);
					res.end('Failed to get data from collection');
				} else {
                    if (mongoRes.length > 0) {
                        var data = JSON.stringify(mongoRes);
                        console.log(data);
						res.end(data);
                    } else {
                        res.end('{"error: "no trade record found"}');
                    }
                }
            });
        }
    });
}

function getTradeRequestObject(req) {
	var reqObject = null;
	console.log("req.body :: "+req.body);
	if(req.body != null) {
		reqObject = req.body;
	}
	return reqObject;
}

function updateTradeServiceRequest(req, res) {
	var reqObject = getTradeRequestObject(req);
	if (reqObject != null) {
		
		if(reqObject.tradeId === null) {
			//new insert
			mongoDB.onConnect(function (err, db, objectId) {
				if (err) {
					console.log(err.stack);
					res.end('failed to connect with mongo db');
				}
				else {
					var message;
					var tradeId;
					db.collection("counters").findAndModify(
						{ counterId: 'tradeId' },
						[['_id','asc']],  // sort order
						{ $inc: { seq: 1 } },
						{ upsert: true, new: true },
						function (err, output) {
						if(err){
							message=err;
							db.close();
						}else{
							reqObject.tradeId = output.value.seq;
							db.collection("trades").insert(reqObject, function(err, res) {
								if (err) {
									message = err;
								}
								else {
									message = "Trade has been successfully inserted."
								}
								db.close();
								getAllTradesAndSendDataToNotificationService();
							});
						}
						res.end(message);
					});			
										
				}
			});
		}
		else {
			// Update Trade
			var message = "";
			mongoDB.onConnect(function (err, db, objectId) {
				if (err) {
					//res.end('failed to connect with mongo db');
					message = "Failed to connect with mongo db";
				}
				else {
					db.collection("trades").update({tradeId: reqObject.tradeId}, reqObject);
					db.close();
					getAllTradesAndSendDataToNotificationService();
					message = "Trade has been successfully updated.";
					//res.end("Trade has been successfully updated.");
				}
			});
			res.end(message);
		}
	}
	else {
		res.end('Invalid Request.');
	}
}


function deleteTradeServiceRequest(req, res) {
	var reqObject = getTradeRequestObject(req);
	if (reqObject !== null) {
		console.log("Delete req for tradeID :"+ reqObject.tradeId);
		mongoDB.onConnect(function (err, db, objectId) {
			if (err) {
				res.end('failed to connect with mongo db');
			}
			else {
				db.collection("trades").remove({ tradeId : reqObject.tradeId });
				db.close();
				getAllTradesAndSendDataToNotificationService();
				res.end("Trade has been successfully deleted.");
			}
		});
	}
	else {
		res.end('Invalid Request.');
	}
}

function sendDataToNotificationService(obj) {
	console.log("object : "+obj);
	var headers = {
        'User-Agent':       'NodeJS_TradeService/0.0.1',
        'Content-Type':     'application/json'
	}
	
	var options = {
		url : config.producerClient,
		method : 'POST',
		headers: headers,
        body: obj
	};

	console.log("Sending request to notification service.");
	// Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        } else {
			console.log(error);
		}
    })
}

function getAllTradesAndSendDataToNotificationService() {
	mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
        } else {
            db.collection('trades').find({}, {_id:0}).toArray(function (err, mongoRes) {
                if (err) {
                    console.log(err.stack);
                } else {
                    if (mongoRes.length > 0) {
                        var data = JSON.stringify(mongoRes);
						sendDataToNotificationService(data);
					} else {
						console.log("no trade record found.");
                    }
                }
            });
        }
    });
}


module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);

	router.get("/", welcome);
    router.get("/health", health);
    router.get("/get/trades/all", getAllTrades);
    router.post("/update/trade", updateTrade);
    router.post("/delete/trade", deleteTrade);
} 

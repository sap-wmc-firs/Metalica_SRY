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
	console.log("get all trades.");
	getAllTradesServiceRequest(res, null);
};

var updateTrade =  function(req, res, next){
	console.log("update trade");
	updateTradeServiceRequest(res, null, req.body);
};

var deleteTrade = function(req, res, next){
    console.log("delete trade");
	deleteTradeServiceRequest(res, null, req.body);
};

// request handlers
function getAllTradesServiceRequest(res, socket) {
	mongoDB.onConnect(function (err, db, objectId) {
        if (err) {
            console.log(err.stack);
            if (res) {
                res.end('Failed to connect with mongo db.');
            } else {
                socket.emit('ALLTRADES', {
                    error: 'Failed to connect with mongo db'
                });
            }
        } else {
            db.collection('trades').find({}, {_id:0}).toArray(function (err, mongoRes) {
                if (err) {
                    console.log(err.stack);
                    if (res) {
                        res.end('Failed to get data from collection');
                    } else {
                        socket.emit('ALLTRADES', {
                            error: 'Failed to get data from collection'
                        });
                    }
                } else {
                    if (mongoRes.length > 0) {
                        var data = JSON.stringify(mongoRes);
                        console.log(data);
						if (res) {
                            res.end(data);
                        } else {
                            socket.emit('ALLTRADES', {
                                data
                            });
                        }
                    } else {
                        if (res) {
                            res.end('{"error: "no trade record found"}');
                        } else {
                            socket.emit('ALLTRADES', {
                                error: '{"error: "no trade record found"}'
                            });
                        }
                    }
                }
            });
        }
    });
}

function updateTradeServiceRequest(res, socket, req) {
	console.log("req.body ::"+req.body);
	if (req!==undefined && req!==null) {
		var side = req.side;
		if (side===undefined || side===null) {
			side = "";
		}
		var quantity = req.quantity;
		if (quantity===undefined || quantity===null) {
			quantity = "";
		}
		var price = req.price;
		if (price===undefined || price===null) {
			price = "";
		}
		var tradeDate = req.tradeDate;
		if (tradeDate===undefined || tradeDate===null) {
			tradeDate = "";
		}
		var status = req.status;
		if (status===undefined || status===null) {
			status = "";
		}
		var counterParty = req.counterParty;
		if (counterParty===undefined || counterParty===null) {
			counterParty = "";
		}
		var commodity = req.commodity;
		if (commodity===undefined || commodity===null) {
			commodity = "";
		}
		var location = req.location;
		if (location===undefined || location===null) {
			location = "";
		}
		if(req.tradeId===undefined || req.tradeId===null) {
			//new insert
			mongoDB.onConnect(function (err, db, objectId) {
				if (err) {
					console.log(err.stack);
					if (res) {
						res.end('failed to connect with mongo db');
					} else {
						socket.emit('UPDATETRADE', {
							error: 'failed to connect with mongo db'
						});
					}
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
							tradeId = output.value.seq;
							var obj = {
								 tradeId: tradeId,
								 side: side,
								 quantity: quantity,
								 price: price,
								 tradeDate: tradeDate,
								 status: status,
								 counterParty: counterParty,
								 commodity: commodity,
								 location: location
							};
							db.collection("trades").insert(obj, function(err, res) {
								if (err) {
									message = err;
								}
								else {
									message = "trade inserted."
								}
								db.close();
							});
							sendDataToNotificationService(obj);
						}
					});			
					if (res) {
						res.end(message);
					} else {
						socket.emit('ALLTRADES', {
							message
						});
					}					
				}
			});
		}
		else {
			//old update
			mongoDB.onConnect(function (err, db, objectId) {
				if (err) {
					if (res) {
						res.end('failed to connect with mongo db');
					} else {
						socket.emit('UPDATETRADE', {
							error: 'failed to connect with mongo db'
						});
					}
				}
				else {
					var obj = {
						 tradeId: req.tradeId,
						 side: side,
						 quantity: quantity,
						 price: price,
						 tradeDate: tradeDate,
						 status: status,
						 counterParty: counterParty,
						 commodity: commodity,
						 location: location
					};
					db.collection("trades").update(
					   { tradeId: req.tradeId},
							obj
					)
					var successMessage = "trade updated.";
					var dataToSend = JSON.stringify(obj);
					console.log(dataToSend);
					sendDataToNotificationService(dataToSend);
					if (res) {
                        res.end(successMessage);
                    } else {
                        socket.emit('UPDATETRADE', {
                            successMessage
                        });
                    }
				}
			});
		}
	}
	else {
		if (res) {
            res.end('Invalid Request.');
        } else {
			socket.emit('UPDATETRADE', {
				error: 'Invalid Request.'
			});
		}
	}
}


function deleteTradeServiceRequest(res, socket, req) {
	if (req!==undefined && req!==null) {
		mongoDB.onConnect(function (err, db, objectId) {
			if (err) {
				if (res) {
					res.end('failed to connect with mongo db');
					} else {
					socket.emit('DELETETRADE', {
						error: 'failed to connect with mongo db'
					});
				}
			}
			else {
				db.collection("trades").remove({ tradeId : req.tradeId });
				var successMessage = "deleted trade";
				if (res) {
					res.end(successMessage);
				} 
				else {
					socket.emit('DELETETRADE', {
						successMessage
					});
				}
			}
		});
	}
	else {
		if (res) {
            res.end('Invalid Request.');
        } else {
			socket.emit('DELETETRADE', {
				error: 'Invalid Request.'
			});
		}
	}
}

function sendDataToNotificationService(obj) {
	console.log("object : "+obj);
	var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/json'
	}
	
	var options = {
		url : config.producerClient,
		method : 'POST',
		headers: headers,
        body: obj
	};

	console.log("Sending request to notification service.");
	/*request(options, function(error, response, body) {
        if(error) {
            console.log(error);
        } else {
            console.log(response);
            console.log(body);
        }
	});*/
	
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

module.exports = function(app) {
    var router = express.Router();            
    app.use('/'+config.mainRoute, router);

	router.get("/", welcome);
    router.get("/health", health);
    router.get("/get/trades/all", getAllTrades);
    router.post("/update/trade", updateTrade);
    router.post("/delete/trade", deleteTrade);
} 

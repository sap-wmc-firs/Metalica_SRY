//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var config = require('../config.json');

chai.use(chaiHttp);

/*
  * Test the /POST routes
  */
describe('/POST trade data to MQ', () => {
    it('it should trade data to MQ.', (done) => {
        var tradeObj = new Object();
        tradeObj.tradeId = 9999;
        tradeObj.side = "Buy";
        tradeObj.quantity = 111;
        tradeObj.price = 1500;
        tradeObj.tradeDate = "2018-01-26";
        tradeObj.counterParty = "FG";
        tradeObj.commodity = "SLVR";
        tradeObj.location = "HON";
        tradeObj.status = "OPEN";
        var tradeDataArr = {tradeObj};
      chai.request(server)
          .post('/'+config.mainRoute+'/addTradeToQueue')
          .set('content-type', 'application/json')
          .send(tradeDataArr)
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

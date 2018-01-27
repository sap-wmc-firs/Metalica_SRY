//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var config = require('../config.json');

chai.use(chaiHttp);

/*
  * Test the /GET routes
  */
describe('/GET all existing trades', () => {
    it('it should return all existing trades.', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/get/trades/all')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});
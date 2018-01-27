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
describe('/GET price of all metals', () => {
    it('it should return price of all metals.', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/price/all')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

describe('/GET price of a metal [SLVR]', () => {
    it('it should return price of a metal [SLVR].', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/price/SLVR')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});
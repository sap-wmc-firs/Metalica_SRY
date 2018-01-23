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
describe('/GET ref data details for locations', () => {
    it('it should get ref data details locations', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/entities/locations')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

describe('/GET ref data details for commodities', () => {
    it('it should get ref data details commodities', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/entities/commodities')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

describe('/GET ref data details for counterparties', () => {
    it('it should get ref data details counterparties', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/entities/counterparties')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

describe('/GET ref data detail for location NYC', () => {
    it('it should get ref data detail for location NYC', (done) => {
      chai.request(server)
          .get('/'+config.mainRoute+'/entities/locations/NYC')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});
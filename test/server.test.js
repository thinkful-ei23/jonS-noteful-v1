'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function () {
  it('GET request "/" should return the index page', function() {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function() {
  it('should respond with 404 when given a bad path', function() {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('notes/api', function() {
  it('should list items on GET', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.at.least(1);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');

        });
      });
  });

  it('should list specific item on GET', function() {
    let id = '';

    return (
      chai  
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          id = res.body[0].id;

          return chai
            .request(app)
            .get(`/api/notes/${id}`);
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        })
    );
  });

  it('should add item on POST', function() {
    const newItem = {title: 'abc', content: 'test test description test'};

    return chai 
      .request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content', 'id');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  it('should update item on PUT', function() {
    const updateItem = { title: 'abc', content: 'test test description test' };

    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(function (res) {
          updateItem.id = res.body[0].id;

          return chai
            .request(app)
            .put(`/api/notes/${updateItem.id}`)
            .send(updateItem);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
        })
    );
  });

  it('should delete item on DELETE', function() {
    return chai
      .request(app)
      .get('/api/notes')
      .then(function(res){
        return chai.request(app)
          .delete(`/api/notes/${res.body[0].id}`);
      })
      .then(function (res) {
        expect(res).to.have.status(204);
      });
  });
});

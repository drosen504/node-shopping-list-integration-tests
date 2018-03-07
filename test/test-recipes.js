'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Recipes', function() {

  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list items on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
  
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'name', 'ingredients'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });
  
  it('should add an item on POST', function() {
    const newRecipe = {name: 'Chicken Curry', ingredients: ['chicken thighs', 'curry powder', 'cream']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.ingredients).to.be.a('array');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      });
  });
  
  it('should update items on PUT', function() {
    const updateData = {
      name: 'Spinach Dip',
      ingredients: ['cream cheese', 'spinach', 'cheese']
    };
  
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });
  
//   // test strategy:
//   //  1. GET shopping list items so we can get ID of one
//   //  to delete.
//   //  2. DELETE an item and ensure we get back a status 204
//   it('should delete items on DELETE', function() {
//     return chai.request(app)
//     // first have to get so we have an `id` of item
//     // to delete
//       .get('/shopping-list')
//       .then(function(res) {
//         return chai.request(app)
//           .delete(`/shopping-list/${res.body[0].id}`);
//       })
//       .then(function(res) {
//         expect(res).to.have.status(204);
//       });
//   });
});
  
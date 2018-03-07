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
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
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
        // response should be deep equal to `newRecipe` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      });
  });
  
//   // test strategy:
//   //  1. initialize some update data (we won't have an `id` yet)
//   //  2. make a GET request so we can get an item to update
//   //  3. add the `id` to `updateData`
//   //  4. Make a PUT request with `updateData`
//   //  5. Inspect the response object to ensure it
//   //  has right status code and that we get back an updated
//   //  item with the right data in it.
//   it('should update items on PUT', function() {
//     // we initialize our updateData here and then after the initial
//     // request to the app, we update it with an `id` property so
//     // we can make a second, PUT call to the app.
//     const updateData = {
//       name: 'foo',
//       checked: true
//     };
  
//     return chai.request(app)
//     // first have to get so we have an idea of object to update
//       .get('/shopping-list')
//       .then(function(res) {
//         updateData.id = res.body[0].id;
//         // this will return a promise whose value will be the response
//         // object, which we can inspect in the next `then` block. Note
//         // that we could have used a nested callback here instead of
//         // returning a promise and chaining with `then`, but we find
//         // this approach cleaner and easier to read and reason about.
//         return chai.request(app)
//           .put(`/shopping-list/${updateData.id}`)
//           .send(updateData);
//       })
//     // prove that the PUT request has right status code
//     // and returns updated item
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.deep.equal(updateData);
//       });
//   });
  
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
  
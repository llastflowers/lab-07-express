require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Event');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an event', () => {
    return request(app)
      .post('/api/v1/events')
      .send({
        recipeId: 'cookies',
        dateOfEvent: '1991-05-10',
        notes: 'best cookies ever',
        rating: 100
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'cookies',
          dateOfEvent: '1991-05-10',
          notes: 'best cookies ever',
          rating: 100,
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const events = await Recipe.create([
      { recipeId: 'cookies', dateOfEvent: '1991-05-10', notes: 'best cookies ever', rating: 100, },
      { recipeId: 'cake', dateOfEvent: '1991-05-10', notes: 'best cake ever', rating: 100, },
      { recipeId: 'pie', dateOfEvent: '1991-05-10', notes: 'best pie ever', rating: 100, }
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            recipeId: recipe.name
          });
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.create({
      recipeId: 'cookies',
      dateOfEvent: '1991-05-10',
      notes: 'best cookies ever',
      rating: 100
    });

    return request(app)
      .get(`/api/v1/events/${recipe._id}`)
      .send({ name: 'cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'cookies',
          dateOfEvent: '1991-05-10',
          notes: 'best cookies ever',
          rating: 100,
          __v: 0
        });
      });
  });
  
  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      recipeId: 'cookies',
      dateOfEvent: '1991-05-10',
      notes: 'best cookies ever',
      rating: 100
    });

    return request(app)
      .patch(`/api/v1/events/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'cookies',
          dateOfEvent: '1991-05-10',
          notes: 'best cookies ever',
          rating: 100,
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.create({
      recipeId: 'cookies',
      dateOfEvent: '1991-05-10',
      notes: 'best cookies ever',
      rating: 100
    });

    return request(app)
      .delete(`/api/v1/events/${recipe._id}`)
      .send({ name: 'cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'cookies',
          dateOfEvent: '1991-05-10',
          notes: 'best cookies ever',
          rating: 100,
          __v: 0
        });
      });
  });
});

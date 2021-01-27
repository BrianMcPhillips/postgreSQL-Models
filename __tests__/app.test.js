const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Cat = require('../lib/models/cat');

describe('demo routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new cat via POST', async() => {
    const response = await request(app)
      .post('/api/v1/cats')
      .send({ name: 'garfield', weight: '14 lbs', age: 14 });

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: 'garfield',
      weight: '14 lbs',
      age: 14
    });
  });

  it('reads cat by id', async() => {
    
    const newCat = await Cat.insert({
      name: 'garfield',
      weight: '14 lbs',
      age: 14
    });

    const response = await request(app)
      .get(`/api/v1/cats/${newCat.id}`);

    expect(response.body).toEqual({
      id: newCat.id,
      name: 'garfield',
      weight: '14 lbs',
      age: 14
    });
  });

  it('updates cat by id', async() => {
    const garfield = await Cat.insert({
      name: 'Cat',
      weight: '7 lbs',
      age: 8
    });

    const updatedCat = {
      name: 'Cat',
      weight: '10 lbs',
      age: 10

    };

    const response = await request(app)
      .patch(`/api/v1/cats/${garfield.id}`)
      .send(updatedCat);
    

    expect(response.body).toEqual({
      id: garfield.id,
      name: 'Cat',
      weight: '10 lbs',
      age: 10
    });
  });


  it('deletes a cat by id via DELETE', async() => {
    const createdCat = await Cat.insert({
      name: 'garfield',
      weight: '14 lbs',
      age: 14
    });

    const response = await request(app)
      .delete(`/api/v1/cats/${createdCat.id}`);

    expect(response.body).toEqual({
      id: createdCat.id,
      name: 'garfield',
      weight: '14 lbs',
      age: 14
    });
  });
});

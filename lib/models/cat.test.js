const Cat = require('./cat.js');
const pool = require('../utils/pool.js');
const fs = require('fs');
describe('Cat model', () => {
  beforeEach(() => {

    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new cat into the database', async() => {
    const createdCat = await Cat.insert({ name: 'garfield', weight: '12 lbs', age: 10 });

    const { rows } = await pool.query('SELECT * FROM cats WHERE id = $1', [createdCat.id]);
    
    expect(rows[0]).toEqual(createdCat);
  });

  it('finds a cat by id', async() => {
    const garfield = await Cat.insert({
      name: 'garfield',
      weight: '14 lbs',
      age: 5
    });
    const foundCat = await Cat.findById(garfield.id);

    expect(foundCat).toEqual({
      id: garfield.id,
      name: 'garfield',
      weight: '14 lbs',
      age: 5
    });
  });

  it('finds all cats', async() => {
    await Promise.all([
      Cat.insert({
        name: 'garfield',
        weight: '14 lbs',
        age: 5
      }),
      Cat.insert({
        name: 'tiger',
        weight: '4 lbs',
        age: 1
      }),
      Cat.insert({
        name: 'predator',
        weight: '21 lbs',
        age: 4
      }),
    ]);

    const cats = await Cat.find();

    expect(cats).toEqual(expect.arrayContaining([
      { id: expect.any(Number), name: 'garfield', weight: '14 lbs', age: 5 },
      { id: expect.any(Number), name: 'tiger', weight: '4 lbs', age: 1 },
      { id: expect.any(Number), name: 'predator', weight: '21 lbs', age: 4 }
    ]));
  });
  
  it('updates a row by id', async() => {
    const createdCat = await Cat.insert({
      name: 'lion',
      weight: '250 lbs',
      age: 10
    });

    const updatedCat = await Cat.update(createdCat.id, {
      name: 'lion',
      weight: '125 lbs',
      age: 14
    });

    expect(updatedCat).toEqual({
      id: createdCat.id,
      name: 'lion',
      weight: '125 lbs',
      age: 14
    });
  });

  it('deletes a row by id', async() => {
    const createdCat = await Cat.insert({
      name: 'garfield',
      weight: '12 lbs',
      age: 7
    });
    const deletedCat = await Cat.delete(createdCat.id);
    
    expect(deletedCat).toEqual({
      id: createdCat.id,
      name: 'garfield',
      weight: '12 lbs',
      age: 7
    });
  });
});

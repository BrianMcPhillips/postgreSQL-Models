const Bear = require('./bear.js');
const pool = require('../utils/pool.js');
const fs = require('fs');


describe('Bear Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  it('should insert a new bear into the database', async() => {
    const createdBear = await Bear.insert({ name: 'smokey', weight: '400 lbs', scary: false });
    const { rows } = await pool.query('SELECT * FROM bears WHERE id = $1', [createdBear.id]);
    expect(rows[0]).toEqual(createdBear);
  });

  it('finds a bear by id', async() => {
    const smokey = await Bear.insert({
      name: 'smokey',
      weight: '400 lbs',
      scary: false
    });
    const foundBear = await Bear.findById(smokey.id);

    expect(foundBear).toEqual({
      id: smokey.id,
      name: 'smokey',
      weight: '400 lbs',
      scary: false
    });
  });

  it('finds all bears', async() => {
    await Promise.all([
      Bear.insert({
        name: 'smokey',
        weight: '400 lbs',
        scary: false
      }),
      Bear.insert({
        name: 'yogi',
        weight: '200 lbs',
        scary: false
      }),
      Bear.insert({
        name: 'grizzley',
        weight: '800 lbs',
        scary: true
      }),
    ]);

    const bears = await Bear.find();

    expect(bears).toEqual(expect.arrayContaining([
      { id: expect.any(Number), name: 'smokey', weight: '400 lbs', scary: false },
      { id: expect.any(Number), name: 'yogi', weight: '200 lbs', scary: false },
      { id: expect.any(Number), name: 'grizzley', weight: '800 lbs', scary: true }
    ]));
  });

  it('updates a row by id', async() => {
    const createdBear = await Bear.insert({
      name: 'smokey',
      weight: '400 lbs',
      scary: false
    });

    const updatedBear = await Bear.update(createdBear.id, { name: 'smokey',
      weight: '600 lbs',
      scary: true
    });

    expect(updatedBear).toEqual({
      id: createdBear.id,
      name: 'smokey',
      weight: '600 lbs',
      scary: true
    });
  });

  it('deletes a row by id', async() => {
    const createdBear = await Bear.insert({
      name: 'smokey',
      weight: '400 lbs',
      scary: false
    });

    const deletedBear = await Bear.delete(createdBear.id);

    expect(deletedBear).toEqual({
      id: createdBear.id,
      name: 'smokey',
      weight: '400 lbs',
      scary: false
    });
  });

});

const Shoe = require('./shoes.js');
const pool = require('../utils/pool.js');
const fs = require('fs');

describe('Shoe model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new shoe into the database', async() => {
    const createdShoe = await Shoe.insert({ name: 'asics', type: 'trail', color: 'blue', size: 10 });

    const { rows } = await pool.query('SELECT * FROM shoes WHERE id = $1', [createdShoe.id]);

    expect(rows[0]).toEqual(createdShoe);
  });

  it('finds a shoe by id', async() => {
    const asics = await Shoe.insert({
      name: 'asics',
      type: 'trail',
      color: 'blue',
      size: 10
      
    });
    const foundShoe = await Shoe.findById(asics.id);

    expect(foundShoe).toEqual({
      id: asics.id,
      name: 'asics',
      type: 'trail',
      color: 'blue',
      size: 10
    });
  });

  it('finds all shoes', async() => {
    await Promise.all([
      Shoe.insert({
        name: 'asics',
        type: 'trail',
        color: 'blue',
        size: 10
      }),
      Shoe.insert({
        name: 'nike',
        type: 'road',
        color: 'yellow',
        size: 10
      }),
      Shoe.insert({
        name: 'adidas',
        type: 'trainer',
        color: 'black',
        size: 10
      }),
    ]);

    const shoes = await Shoe.find();

    expect(shoes).toEqual(expect.arrayContaining([
      { id: expect.any(Number), name: 'asics', type: 'trail', color: 'blue', size: 10 },
      { id: expect.any(Number), name: 'nike', type: 'road', color: 'yellow', size: 10 },
      { id: expect.any(Number), name: 'adidas', type: 'trainer', color: 'black', size: 10 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdShoe = await Shoe.insert({
      name: 'reebok',
      type: 'road',
      color: 'red',
      size: 10
    });

    const updatedShoe = await Shoe.update(createdShoe.id, {
      name: 'reebok',
      type: 'track',
      color: 'green',
      size: 14
    });

    expect(updatedShoe).toEqual({
      id: createdShoe.id,
      name: 'reebok',
      type: 'track',
      color: 'green',
      size: 14
    });
  });

  it('deletes a row by id', async() => {
    const createdShoe = await Shoe.insert({
      name: 'asics',
      type: 'road',
      color: 'blue',
      size: 10
    });
    const deletedShoe = await Shoe.delete(createdShoe.id);
    
    expect(deletedShoe).toEqual({
      id: createdShoe.id,
      name: 'asics',
      type: 'road',
      color: 'blue',
      size: 10
    });
  });

});

const Skate = require('./skate.js');
const pool = require('../utils/pool.js');
const fs = require('fs');

describe('Skate model', () => {
  beforeEach(() => {
  
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  it('insert a new skate into the database', async() => {
    const createdSkate = await Skate.insert({ name: 'ice skate', type: 'bauer', size: 10, sick: true });
  
    const { rows } = await pool.query('SELECT * FROM skates WHERE id = $1', [createdSkate.id]);
      
    expect(rows[0]).toEqual(createdSkate);
  });

  it('finds a skate by id', async() => {
    const iceSkate = await Skate.insert({
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });
    const foundSkate = await Skate.findById(iceSkate.id);

    expect(foundSkate).toEqual({
      id: iceSkate.id,
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });
  });

  it('finds all skates', async() => {
    await Promise.all([
      Skate.insert({
        name: 'ice skate',
        type: 'bauer',
        size: 10,
        sick: true
      }),
      Skate.insert({
        name: 'roller skate',
        type: 'CCM',
        size: 12,
        sick: true
      }),
      Skate.insert({
        name: 'quad skate',
        type: 'generic',
        size: 8,
        sick: true
      }),
    ]);

    const skates = await Skate.find();

    expect(skates).toEqual(expect.arrayContaining([
      { id: expect.any(Number), name: 'ice skate', type: 'bauer', size: 10, sick: true },
      { id: expect.any(Number), name: 'roller skate', type: 'CCM', size: 12, sick: true },
      { id: expect.any(Number), name: 'quad skate', type: 'generic', size: 8, sick: true }
    ]));
  });

  it('updates a row by id', async() => {
    const createdSkate = await Skate.insert({
      name: 'ice skate',
      type: 'CCM',
      size: 12,
      sick: true
    });

    const updatedSkate = await Skate.update(createdSkate.id, {
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });

    expect(updatedSkate).toEqual({
      id: createdSkate.id,
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });
  });

  it('deletes a row by id', async() => {
    const createdSkate = await Skate.insert({
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });
    const deletedSkate = await Skate.delete(createdSkate.id);
    
    expect(deletedSkate).toEqual({
      id: createdSkate.id,
      name: 'ice skate',
      type: 'bauer',
      size: 10,
      sick: true
    });
  });
});

const Monitor = require('./monitor.js');
const pool = require('../utils/pool.js');
const fs = require('fs');

describe('Monitor Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  it('should insert a new monitor into the database', async() => {
    const createdMonitor = await Monitor.insert({ brand: 'Genelec', size: 7, sick: true });
    const { rows } = await pool.query('SELECT * FROM monitors WHERE id = $1', [createdMonitor.id]);
    expect(rows[0]).toEqual(createdMonitor);
  });

  it('finds a monitor by id', async() => {
    const genelec = await Monitor.insert({
      brand: 'Genelec',
      size: 7,
      sick: true
    });
    const foundMonitor = await Monitor.findById(genelec.id);

    expect(foundMonitor).toEqual({
      id: genelec.id,
      brand: 'Genelec',
      size: 7,
      sick: true
    });
  });

  it('finds all monitors', async() => {
    await Promise.all([
      Monitor.insert({
        brand: 'Genelec',
        size: 7,
        sick: true
      }),
      Monitor.insert({
        brand: 'ADAM AUDIO',
        size: 8,
        sick: false
      }),
      Monitor.insert({
        brand: 'JBL',
        size: 5,
        sick: true
      }),
    ]);

    const monitors = await Monitor.find();

    expect(monitors).toEqual(expect.arrayContaining([
      { id: expect.any(Number), brand: 'Genelec', size: 7, sick: true },
      { id: expect.any(Number), brand: 'ADAM AUDIO', size: 8, sick: false },
      { id: expect.any(Number), brand: 'JBL', size: 5, sick: true }
    ]));
  });

  it('updates a row by id', async() => {
    const createdMonitor = await Monitor.insert({
      brand: 'Genelec',
      size: 7,
      sick: true
    });

    const updatedMonitor = await Monitor.update(createdMonitor.id, { 
      brand: 'Genelec',
      size: 5,
      sick: false
    });

    expect(updatedMonitor).toEqual({
      id: createdMonitor.id,
      brand: 'Genelec',
      size: 5,
      sick: false
    });

  });

  it('deletes a row by id', async() => {
    const createdMonitor = await Monitor.insert({
      brand: 'Genelec',
      size: 7,
      sick: true
    });

    const deletedMonitor = await Monitor.delete(createdMonitor.id);

    expect(deletedMonitor).toEqual({
      id: createdMonitor.id,
      brand: 'Genelec',
      size: 7,
      sick: true
    });
  });
});


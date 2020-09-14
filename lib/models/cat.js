const pool = require('../utils/pool');

class Cat {
  id;
  name;
  weight;
  age;
  
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.weight = row.weight;
    this.age = row.age;

  }

  static async insert(cat) {
    const { rows } = await pool.query('INSERT INTO cats (name, weight, age) VALUES($1, $2, $3) RETURNING *', [cat.name, cat.weight, cat.age]);
    
    return new Cat(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM cats WHERE id = $1',
      [id]
    );
    return new Cat(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM cats'
    );
    return rows.map(row => new Cat(row));
  }

  static async update(id, updatedCat) {
    const { rows } = await pool.query(
      `UPDATE cats SET
      name = $1,
      weight = $2,
      age = $3 
      WHERE id = $4 RETURNING *`, [updatedCat.name, updatedCat.weight, updatedCat.age, id]
    );
    return new Cat(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM cats WHERE id = $1 RETURNING *',
      [id]
    );

    return new Cat(rows[0]);
  }
}

module.exports = Cat;

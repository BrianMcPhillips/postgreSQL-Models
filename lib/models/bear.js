const pool = require('../utils/pool');

class Bear {
  id;
  name;
  weight;
  age;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.weight = row.weight;
    this.scary = row.scary;
    
  }

  static async insert(bear) {
    const { rows } = await pool.query('INSERT INTO bears (name, weight, scary) VALUES($1, $2, $3) RETURNING *',
      [bear.name, bear.weight, bear.scary]);

    return new Bear(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM bears WHERE id = $1', [id]
    );
    return new Bear(rows[0]);
  }
  
  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM bears'
    );
    return rows.map(row => new Bear(row));
  }

  static async update(id, updatedBear) {
    const { rows } = await pool.query(
      `UPDATE bears SET
      name = $1,
      weight = $2,
      scary = $3
      WHERE id = $4 RETURNING *`, [updatedBear.name, updatedBear.weight, updatedBear.scary, id]
    );
    return new Bear(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM bears WHERE id = $1 RETURNING *',
      [id]
    );

    return new Bear(rows[0]);
  }

}
module.exports = Bear;

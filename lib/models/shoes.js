const pool = require('../utils/pool');
const Cat = require('./cat');

class Shoe {
  id;
  name;
  type;
  color;
  size;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.type = row.type;
    this.color = row.color;
    this.size = row.size;

  }

  static async insert(shoe) {
    const { rows } = await pool.query('INSERT INTO shoes (name, type, color, size) VALUES($1, $2, $3, $4) RETURNING *', [shoe.name, shoe.type, shoe.color, shoe.size]);
    
    return new Shoe(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM shoes WHERE id = $1', [id]
    );
    return new Shoe(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM shoes'
    );
    return rows.map(row => new Shoe(row));
  }

  static async update(id, updatedShoe) {
    const { rows } = await pool.query(
      `UPDATE shoes SET
      name = $1,
      type = $2,
      color = $3,
      size = $4
      WHERE id = $5 RETURNING *`, [updatedShoe.name, updatedShoe.type, updatedShoe.color, updatedShoe.size, id]
    );
    return new Shoe(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM shoes WHERE id = $1 RETURNING *',
      [id]
    );
    return new Shoe(rows[0]);
  }
}

module.exports = Shoe;

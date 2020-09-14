const pool = require('../utils/pool');

class Skate {
  id;
  name;
  type;
  size;
  sick;
  
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.type = row.type;
    this.size = row.size;
    this.sick = row.sick;

  }

  static async insert(skate) {
    const { rows } = await pool.query('INSERT INTO skates (name, type, size, sick) VALUES($1, $2, $3, $4) RETURNING *', [skate.name, skate.type, skate.size, skate.sick]);
    
    return new Skate(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM skates WHERE id = $1',
      [id]
    );
    return new Skate(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM skates'
    );
    return rows.map(row => new Skate(row));
  }

  static async update(id, updatedSkate) {
    const { rows } = await pool.query(
      `UPDATE skates SET
      name = $1,
      type = $2,
      size = $3,
      sick = $4
      WHERE id = $5 RETURNING *`, [updatedSkate.name, updatedSkate.type, updatedSkate.size, updatedSkate.sick, id]
    );
    return new Skate(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM skates WHERE id = $1 RETURNING *',
      [id]
    );

    return new Skate(rows[0]);
  }
}
module.exports = Skate; 

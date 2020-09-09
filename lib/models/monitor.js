const pool = require('../utils/pool');

class Monitor {
  id;
  brand;
  size;
  sick;

  constructor(row) {
    this.id = row.id;
    this.brand = row.brand;
    this.size = row.size;
    this.sick = row.sick;
  }
  static async insert(monitor) {
    const { rows } = await pool.query('INSERT INTO monitors (brand, size, sick) VALUES($1, $2, $3) RETURNING *',
      [monitor.brand, monitor.size, monitor.sick]);
    return new Monitor(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM monitors WHERE id = $1', [id]
    );
    return new Monitor(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM monitors'
    );
    return rows.map(row => new Monitor(row));
  }

  static async update(id, updatedMonitor) {
    const { rows } = await pool.query(
      `UPDATE monitors SET
      brand = $1,
      size = $2,
      sick = $3
      WHERE id = $4 RETURNING *`, [updatedMonitor.brand, updatedMonitor.size, updatedMonitor.sick, id]
    );
    return new Monitor(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM monitors WHERE id = $1 RETURNING *',
      [id]
    );

    return new Monitor(rows[0]);
  }


}

module.exports = Monitor;

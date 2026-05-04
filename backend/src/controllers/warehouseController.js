const pool = require('../config/database');

// Get all warehouse inventory
exports.getAllInventory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM warehouse_inventory');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory by product ID
exports.getInventoryByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      'SELECT * FROM warehouse_inventory WHERE product_id = $1',
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory stock
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const result = await pool.query(
      'UPDATE warehouse_inventory SET quantity = $1 WHERE product_id = $2 RETURNING *',
      [quantity, productId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new inventory
exports.addInventory = async (req, res) => {
  try {
    const { product_id, quantity, location } = req.body;
    const result = await pool.query(
      'INSERT INTO warehouse_inventory (product_id, quantity, location) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
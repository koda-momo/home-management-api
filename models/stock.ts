import { pool } from '../config/database';
import { InventoryItem } from '../public/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class StockModel {
  static async getAll(): Promise<InventoryItem[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM stock ORDER BY id'
    );
    return rows as InventoryItem[];
  }

  static async getById(id: number): Promise<InventoryItem | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM stock WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as InventoryItem) : null;
  }

  static async getByName(name: string): Promise<InventoryItem[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM stock WHERE name LIKE ? ORDER BY id',
      [`%${name}%`]
    );
    return rows as InventoryItem[];
  }

  static async updateCount(id: number, newCount: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE stock SET count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newCount, id]
    );
    return result.affectedRows > 0;
  }
}
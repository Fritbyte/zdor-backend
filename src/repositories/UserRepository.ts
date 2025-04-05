import { User, UserDto } from '@src/models/User';
import { getConnection } from '@src/config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id, username, password, created_at, updated_at FROM users WHERE username = ?',
        [username],
      );
      if (rows.length === 0) return null;
      return rows[0] as User;
    } finally {
      await connection.release();
    }
  }

  async create(user: User): Promise<UserDto> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [user.username, user.password],
      );
      const insertId = result.insertId;
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id, username, created_at, updated_at FROM users WHERE id = ?',
        [insertId],
      );
      if (rows.length === 0) throw new Error('Пользователь не найден после регистрации');

      return rows[0] as UserDto;
    } finally {
      await connection.release();
    }
  }
}

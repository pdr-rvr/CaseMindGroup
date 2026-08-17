import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/db';

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  profile_picture_data: Buffer | null;
  profile_picture_mime_type: string | null;
  profilePictureBase64?: string | null;
  has_avatar?: number;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export class UserModel {
  /**
   * Busca um usuário pelo e-mail (incluindo o hash de senha para autenticação).
   */
  static async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  }

  /**
   * Cria um novo usuário.
   */
  static async create(user: { name: string; email: string; password: string }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [user.name.trim(), user.email.toLowerCase().trim(), user.password]
    );
    return result.insertId;
  }

  /**
   * Busca um usuário por ID com os dados do perfil formatados.
   */
  static async findByIdWithProfileImage(id: number): Promise<UserDTO | null> {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT
        id,
        name,
        email,
        TO_BASE64(profile_picture_data) AS profilePictureBase64,
        profile_picture_mime_type,
        created_at,
        updated_at,
        CASE WHEN profile_picture_data IS NOT NULL THEN 1 ELSE 0 END AS has_avatar
      FROM users
      WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    const row = rows[0];

    let profilePictureUrl: string | null = null;
    if (row.profilePictureBase64 && row.profile_picture_mime_type) {
      profilePictureUrl = `data:${row.profile_picture_mime_type};base64,${row.profilePictureBase64}`;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      profilePictureUrl,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * Busca usuário por ID sem retornar a senha.
   */
  static async findById(id: number): Promise<UserDTO | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at,
    };
  }

  /**
   * Busca apenas a imagem binária do avatar do usuário.
   */
  static async findRawAvatarById(id: number): Promise<{ profile_picture_data: Buffer; profile_picture_mime_type: string } | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT profile_picture_data, profile_picture_mime_type FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0 || !rows[0].profile_picture_data) return null;
    return {
      profile_picture_data: rows[0].profile_picture_data,
      profile_picture_mime_type: rows[0].profile_picture_mime_type || 'image/jpeg',
    };
  }

  /**
   * Atualiza a senha de um usuário por ID.
   */
  static async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Atualiza a senha de um usuário por email.
   */
  static async updatePasswordByEmail(email: string, hashedPassword: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      [hashedPassword, email.toLowerCase().trim()]
    );
    return result.affectedRows > 0;
  }

  /**
   * Atualiza os dados cadastrais (nome).
   */
  static async updateProfile(id: number, data: { name?: string }): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET ? WHERE id = ?',
      [data, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Atualiza ou remove o avatar do usuário.
   */
  static async updateProfilePicture(id: number, imageData: Buffer | null, imageMimeType: string | null): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET profile_picture_data = ?, profile_picture_mime_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [imageData, imageMimeType, id]
    );
    return result.affectedRows > 0;
  }
}

export default UserModel;
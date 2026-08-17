import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/db';
import { calculateReadTimeMinutes } from '../utils/readTime';

export interface ArticleRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  featured_image: Buffer | null;
  featured_image_base64?: string | null;
  image_mime_type: string | null;
  author_id: number;
  author_name: string;
  created_at: Date;
  updated_at: Date;
  has_image: number;
}

export interface ArticleDTO {
  id: number;
  title: string;
  content: string;
  image_mime_type: string | null;
  featured_image?: string | null;
  image_url: string | null;
  author_id: number;
  author_name: string;
  created_at: Date | string;
  updated_at: Date | string;
  read_time_minutes: number;
}

export class ArticleModel {
  /**
   * Converte a linha do banco em um DTO limpo e com URLs apropriadas.
   */
  private static toDTO(row: ArticleRow): ArticleDTO {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      image_mime_type: row.image_mime_type || null,
      featured_image: row.featured_image_base64 || null,
      image_url: row.has_image ? `/api/articles/${row.id}/image` : null,
      author_id: row.author_id,
      author_name: row.author_name,
      created_at: row.created_at,
      updated_at: row.updated_at,
      read_time_minutes: calculateReadTimeMinutes(row.content),
    };
  }

  /**
   * Busca todos os artigos com suporte a filtro de busca por texto e paginação.
   */
  static async findAll(search?: string, limit?: number, offset?: number): Promise<ArticleDTO[]> {
    let query = `
      SELECT
        a.id,
        a.title,
        a.content,
        a.image_mime_type,
        TO_BASE64(a.featured_image) AS featured_image_base64,
        a.author_id,
        u.name AS author_name,
        a.created_at,
        a.updated_at,
        CASE WHEN a.featured_image IS NOT NULL THEN 1 ELSE 0 END AS has_image
      FROM articles a
      JOIN users u ON a.author_id = u.id
    `;
    const params: any[] = [];

    if (search && search.trim()) {
      query += ` WHERE a.title LIKE ? OR a.content LIKE ? OR u.name LIKE ?`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY a.created_at DESC`;

    if (typeof limit === 'number' && limit > 0) {
      query += ` LIMIT ?`;
      params.push(limit);

      if (typeof offset === 'number' && offset >= 0) {
        query += ` OFFSET ?`;
        params.push(offset);
      }
    }

    const [rows] = await pool.query<ArticleRow[]>(query, params);
    return rows.map(ArticleModel.toDTO);
  }

  /**
   * Busca o artigo em destaque mais recente.
   */
  static async findFeatured(): Promise<ArticleDTO | null> {
    const query = `
      SELECT
        a.id,
        a.title,
        a.content,
        a.image_mime_type,
        TO_BASE64(a.featured_image) AS featured_image_base64,
        a.author_id,
        u.name AS author_name,
        a.created_at,
        a.updated_at,
        CASE WHEN a.featured_image IS NOT NULL THEN 1 ELSE 0 END AS has_image
      FROM articles a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.query<ArticleRow[]>(query);
    return rows.length > 0 ? ArticleModel.toDTO(rows[0]) : null;
  }

  /**
   * Busca os artigos recentes (com limite).
   */
  static async findRecent(limit = 3): Promise<ArticleDTO[]> {
    const query = `
      SELECT
        a.id,
        a.title,
        a.content,
        a.image_mime_type,
        TO_BASE64(a.featured_image) AS featured_image_base64,
        a.author_id,
        u.name AS author_name,
        a.created_at,
        a.updated_at,
        CASE WHEN a.featured_image IS NOT NULL THEN 1 ELSE 0 END AS has_image
      FROM articles a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query<ArticleRow[]>(query, [limit]);
    return rows.map(ArticleModel.toDTO);
  }

  /**
   * Busca um artigo pelo seu ID.
   */
  static async findById(id: number): Promise<ArticleDTO | null> {
    const query = `
      SELECT
        a.id,
        a.title,
        a.content,
        a.image_mime_type,
        TO_BASE64(a.featured_image) AS featured_image_base64,
        a.author_id,
        u.name AS author_name,
        a.created_at,
        a.updated_at,
        CASE WHEN a.featured_image IS NOT NULL THEN 1 ELSE 0 END AS has_image
      FROM articles a
      JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.query<ArticleRow[]>(query, [id]);
    return rows.length > 0 ? ArticleModel.toDTO(rows[0]) : null;
  }

  /**
   * Busca apenas os dados binários da imagem para stream/entrega estática com cache.
   */
  static async findRawImageById(id: number): Promise<{ featured_image: Buffer; image_mime_type: string } | null> {
    const query = `SELECT featured_image, image_mime_type FROM articles WHERE id = ?`;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    if (rows.length === 0 || !rows[0].featured_image) {
      return null;
    }
    return {
      featured_image: rows[0].featured_image,
      image_mime_type: rows[0].image_mime_type || 'image/jpeg',
    };
  }

  /**
   * Busca todos os artigos criados por um autor específico.
   */
  static async findByAuthorId(authorId: number): Promise<ArticleDTO[]> {
    const query = `
      SELECT
        a.id,
        a.title,
        a.content,
        a.image_mime_type,
        TO_BASE64(a.featured_image) AS featured_image_base64,
        a.author_id,
        u.name AS author_name,
        a.created_at,
        a.updated_at,
        CASE WHEN a.featured_image IS NOT NULL THEN 1 ELSE 0 END AS has_image
      FROM articles a
      JOIN users u ON a.author_id = u.id
      WHERE a.author_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await pool.query<ArticleRow[]>(query, [authorId]);
    return rows.map(ArticleModel.toDTO);
  }

  /**
   * Cria um novo artigo e retorna o ID gerado.
   */
  static async create(data: {
    title: string;
    content: string;
    featured_image?: Buffer | null;
    image_mime_type?: string | null;
    author_id: number;
  }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO articles SET ?', [data]);
    return result.insertId;
  }

  /**
   * Atualiza um artigo existente.
   */
  static async update(
    id: number,
    data: {
      title?: string;
      content?: string;
      featured_image?: Buffer | null;
      image_mime_type?: string | null;
    }
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE articles SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
  }

  /**
   * Deleta um artigo pelo ID.
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM articles WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default ArticleModel;
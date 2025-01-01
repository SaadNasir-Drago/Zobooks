import { query } from "../database";

export const getUserByEmail = async (email: string): Promise<any>/* Promise<User>*/ => {
  try {
    const result = await query('SELECT user_id, first_name, last_name, email, password FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  } catch (error: unknown) {
      throw error;
    }
}
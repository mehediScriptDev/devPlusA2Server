import bcrypt from "bcrypt";
import pool from "../../config/db.js";
const SALT_ROUNDS = 10;
export const createUser = async (payload) => {
    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const result = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at", [payload.name, payload.email, hashedPassword, payload.role]);
    return result.rows[0];
};
export const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1", [email]);
    return result.rows[0];
};
//# sourceMappingURL=auth.service.js.map
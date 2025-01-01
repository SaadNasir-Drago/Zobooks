import { User } from "../types"; // Import the User type
import { query } from "../database";

// Function to check if a string contains only ASCII characters
const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};

// Function to clean and format user data
const cleanUserData = (user: User): User => {
  return {
    user_id: user.user_id,
    first_name:
      isAscii(user.first_name) && user.first_name?.length
        ? user.first_name?.trim()
        : null,
    last_name:
      isAscii(user.last_name) && user.last_name?.length
        ? user.last_name?.trim()
        : null,
    email:
      isAscii(user.email) && user.email?.length ? user.email?.trim() : null,
    password: user.password?.trim() || null, // Assuming password is always ASCII
    role: isAscii(user.role) && user.role?.length ? user.role?.trim() : null,
  };
};

// Function to insert user data into PostgreSQL
export const seedUsers = async (users: User[]) => {

  // Limit to the first 500 users
  const limitedUsers = users.slice(0, 200);

  for (const userData of limitedUsers) {
    const cleanedUser = cleanUserData(userData);
    try {
      const queryText = `
        INSERT INTO users (
          user_id, first_name, last_name, email, password, role
        ) VALUES (
          $1, $2, $3, $4, $5, $6
        )
        ON CONFLICT (user_id) DO NOTHING;
      `;

      const values = [
        cleanedUser.user_id,
        cleanedUser.first_name,
        cleanedUser.last_name,
        cleanedUser.email,
        cleanedUser.password,
        cleanedUser.role,
      ];

      await query(queryText, values);
    } catch (error) {
      console.error(
        `Error inserting user with ID ${cleanedUser.user_id}:`,
        error
      );
    }
  }
  console.log("User data inserted successfully");
  const useridResult = await query("SELECT MAX(user_id) FROM users");
  const maxUserId = useridResult.rows[0].max;

  // Reset the sequence to start after the highest user_id
  await query(`ALTER SEQUENCE users_user_id_seq RESTART WITH ${maxUserId + 1}`);
  console.log(`User ID sequence reset to start from ${maxUserId + 1}`);
  
};

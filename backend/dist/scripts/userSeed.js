"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const database_1 = require("../database");
// Function to check if a string contains only ASCII characters
const isAscii = (str) => {
    if (!str)
        return true; // Treat null or undefined as valid
    return /^[\x00-\x7F]*$/.test(str);
};
// Function to clean and format user data
const cleanUserData = (user) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        user_id: user.user_id,
        first_name: isAscii(user.first_name) && ((_a = user.first_name) === null || _a === void 0 ? void 0 : _a.length)
            ? (_b = user.first_name) === null || _b === void 0 ? void 0 : _b.trim()
            : null,
        last_name: isAscii(user.last_name) && ((_c = user.last_name) === null || _c === void 0 ? void 0 : _c.length)
            ? (_d = user.last_name) === null || _d === void 0 ? void 0 : _d.trim()
            : null,
        email: isAscii(user.email) && ((_e = user.email) === null || _e === void 0 ? void 0 : _e.length) ? (_f = user.email) === null || _f === void 0 ? void 0 : _f.trim() : null,
        password: ((_g = user.password) === null || _g === void 0 ? void 0 : _g.trim()) || null, // Assuming password is always ASCII
        role: isAscii(user.role) && ((_h = user.role) === null || _h === void 0 ? void 0 : _h.length) ? (_j = user.role) === null || _j === void 0 ? void 0 : _j.trim() : null,
    };
};
// Function to insert user data into PostgreSQL
const seedUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    for (const userData of users) {
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
            yield (0, database_1.query)(queryText, values);
        }
        catch (error) {
            console.error(`Error inserting user with ID ${cleanedUser.user_id}:`, error);
        }
    }
    console.log("User data inserted successfully");
    const useridResult = yield (0, database_1.query)("SELECT MAX(user_id) FROM users");
    const maxUserId = useridResult.rows[0].max;
    // Reset the sequence to start after the highest user_id
    yield (0, database_1.query)(`ALTER SEQUENCE users_user_id_seq RESTART WITH ${maxUserId + 1}`);
    console.log(`User ID sequence reset to start from ${maxUserId + 1}`);
});
exports.seedUsers = seedUsers;

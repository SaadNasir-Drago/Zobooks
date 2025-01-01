import { z } from 'zod';

// Zod schema for registration validation
export const registerSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const loginSchema = z.object({
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
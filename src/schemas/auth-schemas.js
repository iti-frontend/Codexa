import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is Too short"),
  lastName: z.string().min(2, "Last name is Too short"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

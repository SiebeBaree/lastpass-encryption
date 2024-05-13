import { z } from "zod";
import zxcvbn from "zxcvbn";

export const passwordSchema = z
    .string()
    .min(12, { message: "Password must be at least 12 characters long." })
    .max(99, { message: "Password must be less than 100 characters long." })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[\W_]/, { message: "Password must include at least one special character." })
    .refine((password) => zxcvbn(password).score >= 3, {
        message: "Password must be stronger. Include a mix of letters, numbers, and symbols.",
    });

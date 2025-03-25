import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Your username must be atleast 3 characters long!")
      .max(32, "Your username must be atmost 32 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Your username must only contain letters, numbers, and underscores!",
      ),
    email: z.string().email("Please enter a valid email address!"),
    password: z.string().min(8).max(40),
    confirmPassword: z.string().min(8).max(40),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords must match",
      });
    }
  });

import { z } from "zod";

export const querySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Please keep it under 2000 characters"),
  website: z.string().max(500).optional(), // honeypot, checked server-side
});

export type QueryInput = z.infer<typeof querySchema>;

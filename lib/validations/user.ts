import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR', 'SUBSCRIBER']),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING']),
  bio: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
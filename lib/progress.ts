import { z } from "zod";

// Mirrors validState() in public/game.js. The server is the authority:
// anything outside this shape is rejected, never stored.
const MODULE_IDS = [
  "foundations", "conmon", "vdr", "ver", "twentyx",
  "foundations_n", "conmon_n", "vdr_n", "ver_n", "twentyx_n",
] as const;
const moduleId = z.enum(MODULE_IDS);
const NAME_RE = /^[A-Za-z0-9 .'\-]{1,16}$/;

export const ProgressSchema = z.object({
  v: z.literal(1),
  name: z.string().trim().regex(NAME_RE),
  best: z.partialRecord(moduleId, z.number().int().min(0).max(15)),
  cleared: z.partialRecord(moduleId, z.literal(true)),
  codex: z.array(moduleId).max(10),
  last: z.union([moduleId, z.literal("")]),
  settings: z.object({
    speed: z.enum(["normal", "fast", "instant"]),
    sound: z.boolean(),
    big: z.boolean(),
    calm: z.boolean(),
  }).strict(),
}).strict();

export type Progress = z.infer<typeof ProgressSchema>;
export const MAX_BODY_BYTES = 4096;

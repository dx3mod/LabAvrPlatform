import { z } from "zod";

const Configuration = z.object({
  compilerOptions: z
    .object({
      standard: z.string().optional(),
      optLevel: z
        .union([z.number().min(0).max(3), z.literal("s"), z.literal("z")])
        .default("s"),
      noStd: z.boolean().default(false),
    })
    .default({}),

  programOptions: z
    .object({
      programmer: z.string().default("usbasp"),
      customArgs: z.array(z.string()).default([]),
    })
    .default({}),
});

const AvrProjectSolutionSchema = z.object({
  name: z.string(),
  target: z
    .object({
      mcu: z.string(),
      hz: z.number().optional(),
    })
    .optional(),

  rootDir: z.string().default("src"),
  outDir: z.string().default("_build"),

  configurations: z
    .object({
      // debug: z.never(),
      release: Configuration,
    })
    .default({ release: {} }),

  enableRequireMacros: z.boolean().default(true),
});

type AvrProjectSolution = z.infer<typeof AvrProjectSolutionSchema>;

export { AvrProjectSolutionSchema, AvrProjectSolution };

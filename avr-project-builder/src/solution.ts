import { z } from "zod";

const Configuration = z.object({
  compilerOptions: z
    .object({
      standard: z.string().optional(),
      optLevel: z
        .union([z.number().min(0).max(3), z.literal("s"), z.literal("z")])
        .default("s"),
      noStd: z.boolean().default(false),
      lto: z.boolean().default(false),
      args: z.array(z.string()).optional(),
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
  name: z.string().optional(),
  target: z
    .object({
      mcu: z.string(),
      hz: z.number().optional(),
    })
    .optional(),

  rootDir: z.string().default("src"),
  outDir: z.string().default("_build"),
  excludes: z.array(z.string()).default([]),

  configurations: z
    .object({
      debug: Configuration,
      release: Configuration,
    })
    .default({
      release: { compilerOptions: { lto: true } },
      debug: { compilerOptions: { lto: false } },
    }),

  strict: z.boolean().default(true),

  singleNamespace: z.boolean().default(true),

  requireMacros: z.boolean().default(true),
  resolveImports: z.boolean().default(true),
});

type AvrProjectSolution = z.infer<typeof AvrProjectSolutionSchema>;

export { AvrProjectSolutionSchema, AvrProjectSolution };

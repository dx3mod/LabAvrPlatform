import { z } from "zod";

export const LabAvrProjectConfigScheme = z.object({
  artifactName: z.string(),

  target: z.object({
    mcu: z.string(),
    hz: z.number(),
  }).optional(),

  layout: z.object({
    sourcesDir: z.string(),
    headersDir: z.string(),
    vendorDir: z.string(),
    buildDir: z.string(),
  }),
});

export type LabAvrProjectConfig = z.infer<typeof LabAvrProjectConfigScheme>;

export function createLabAvrProjectConfig(
  config: Pick<LabAvrProjectConfig, "artifactName" | "target">,
): LabAvrProjectConfig {
  return {
    artifactName: config.artifactName,
    target: config.target,
    layout: {
      sourcesDir: "src",
      headersDir: "include",
      buildDir: "_build",
      vendorDir: "vendor",
    },
  };
}

import which from "which";

/** Real representation of user environment. */
export interface ToolchainEnvironment {
  compilerPath: string | null;
  programmerPath: string | null;

  utils: {
    objdumpPath: string | null;
    objcopyPath: string | null;
    sizePath: string | null;
  };
}

export async function detectTEnvironment(): Promise<ToolchainEnvironment> {
  const options = { nothrow: true };

  return {
    compilerPath: await which("avr-gcc", options),
    programmerPath: await which("avrdude", options),
    utils: {
      objcopyPath: await which("avr-objcopy", options),
      objdumpPath: await which("avr-objdump", options),
      sizePath: await which("avr-size", options),
    },
  };
}

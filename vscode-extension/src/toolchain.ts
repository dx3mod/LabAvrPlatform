import which from "which";

// /** Real representation of user environment. */
export interface ToolchainEnvironment {
  compiler: { name: string; path: string | null };
  programmer: { name: string; path: string | null };

  utils: {
    objdumpPath: string | null;
    objcopyPath: string | null;
    sizePath: string | null;
  };
}

interface CaptureToolchainEnvOptions {
  /** Compiler name. */
  compiler: string;
  /** Tool name for program MCU. */
  programmer: string;
}

export async function captureToolchainEnv(
  { compiler: compilerName, programmer: progName }: CaptureToolchainEnvOptions,
): Promise<ToolchainEnvironment> {
  const options = { nothrow: true };

  return {
    compiler: {
      name: compilerName,
      path: await which(compilerName, options),
    },
    programmer: {
      name: progName,
      path: await which(progName, options),
    },
    utils: {
      objcopyPath: await which("avr-objcopy", options),
      objdumpPath: await which("avr-objdump", options),
      sizePath: await which("avr-size", options),
    },
  };
}

export async function captureGccToolchainEnv(): Promise<ToolchainEnvironment> {
  return await captureToolchainEnv({
    compiler: "avr-gcc",
    programmer: "avrdude",
  });
}

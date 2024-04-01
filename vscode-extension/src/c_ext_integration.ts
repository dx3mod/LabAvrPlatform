import * as vscode from "vscode";
import { mkdir, readdir, writeFile } from "fs/promises";

import { LabAvrProjectConfig } from "./labproject";
import { ToolchainEnvironment } from "./toolchain";
import { join } from "path";

export async function updateCExtProperties(
  config: LabAvrProjectConfig,
  toolchain: ToolchainEnvironment,
  workspaceFolder: vscode.WorkspaceFolder,
) {
  await mkdir(join(workspaceFolder.uri.fsPath, ".vscode"), { recursive: true });

  const compilerArgs = [
    "-include",
    "avr/io.h",
    "-include",
    "util/delay.h",
  ];

  const defines = [
    "_DEBUG",
    "UNICODE",
    "_UNICODE",

    `F_CPU=${config.target?.hz ?? 0}`,
  ];

  if (config.target) {
    compilerArgs.push(`-mmcu=${config.target?.mcu}`);
  }

  const includeFiles = await readdir(
    join(workspaceFolder.uri.fsPath, config.layout.sourcesDir),
    { recursive: true },
  );

  for (const filename of includeFiles) {
    if (!filename.startsWith("main")) {
      compilerArgs.push("-include", filename);
    }
  }

  // compilerArgs.push(...includeFiles);

  writeFile(
    join(workspaceFolder.uri.fsPath, ".vscode", "c_cpp_properties.json"),
    JSON.stringify(
      {
        configurations: [
          {
            name: (config.target?.mcu ?? "AVR"),
            includePath: [
              `\${workspaceFolder}/${config.layout.sourcesDir}/`,
              `\${workspaceFolder}/${config.layout.headersDir}/`,
            ],
            compilerPath: toolchain.compilerPath,
            compilerArgs,
            defines,
          },
        ],
        version: 4,
      },
      null,
      2,
    ),
  );
}

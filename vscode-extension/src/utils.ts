import * as vscode from "vscode";
import { existsSync } from "fs";
import { join } from "path";
import { detectTEnvironment } from "./toolchain";

export const ProjectConfigFileName = "LabAvrProject";
export const Extension = { name: "Lab Avr Platform", id: "labavrplatform" };

export const INTEGRATION_BACKEND: "clangd" | "vscode" = "clangd";

export const CurrentToolchainEnv = detectTEnvironment();

export function checkIsLabAvrProjectDir(path: string): boolean {
  return existsSync(join(path, ProjectConfigFileName));
}

export const VsCodeHelpers = {
  setContext<T>(name: string, value: T) {
    vscode.commands.executeCommand("setContext", name, value);
  },

  async openFolder(path: string) {
    await vscode.commands.executeCommand(
      "vscode.openFolder",
      vscode.Uri.file(path)
    );
  },
};

export async function checkInstalledToolchain() {
  const toolchainEnv = await CurrentToolchainEnv;

  if (!toolchainEnv.compilerPath && !toolchainEnv.programmerPath) {
    vscode.window.showWarningMessage(
      "Not installed toolchain for development under AVR!",
      "Install"
    );
    return;
  }

  if (!toolchainEnv.compilerPath) {
    vscode.window.showWarningMessage(
      "Not installed AVR GCC toolchain!",
      "Install"
    );
  }

  if (!toolchainEnv.programmerPath) {
    vscode.window.showWarningMessage(
      "Not installed AVRDUDE programmer!",
      "Install"
    );
  }
}

export function getIntegrationBackendFlag() {
  switch (INTEGRATION_BACKEND) {
    case "clangd":
      return "-compile-flags";
    case "vscode":
      return "-c-cpp-properties";
  }
}

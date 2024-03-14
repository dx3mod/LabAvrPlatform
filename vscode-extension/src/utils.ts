import * as vscode from "vscode";
import { existsSync } from "fs";
import { join } from "path";
import { detectTEnvironment } from "./toolchain";

export const ProjectConfigFileName = "LabAvrProject.json";
export const Extension = { name: "Lab Avr Platform", id: "labavrplatform" };

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
      vscode.Uri.file(path),
    );
  },
};

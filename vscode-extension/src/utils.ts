import * as vscode from "vscode";
import { existsSync } from "fs";
import { join } from "path";

export const PROJECT_CONFIG_FILE_NAME = "LabAvrProject.json";
export const Extension = { name: "Lab Avr Platform", id: "labavrplatform" };

export function checkIsLabAvrProjectDir(path: string): boolean {
  return existsSync(join(path, PROJECT_CONFIG_FILE_NAME));
}

export const VsCodeHelpers = {
  setContext<T>(name: string, value: T) {
    vscode.commands.executeCommand("setContext", name, value);
  },
};

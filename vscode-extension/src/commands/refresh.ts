import * as vscode from "vscode";
import {
  checkInstalledToolchain,
  checkIsLabAvrProjectDir,
  VsCodeHelpers,
} from "../utils";

export function refreshProject() {
  checkInstalledToolchain();

  if (vscode.workspace.workspaceFolders) {
    const workspaceFolder = vscode.workspace.workspaceFolders[0];

    VsCodeHelpers.setContext(
      "isLabAvrProject",
      checkIsLabAvrProjectDir(workspaceFolder.uri.fsPath),
    );

    return;
  }

  VsCodeHelpers.setContext("isLabAvrProject", false);
}

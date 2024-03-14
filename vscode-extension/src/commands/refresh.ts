import * as vscode from "vscode";
import { checkIsLabAvrProjectDir, VsCodeHelpers } from "../utils";

export function refreshProject() {
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

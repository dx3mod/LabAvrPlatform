import * as vscode from "vscode";
import { getIntegrationBackendFlag } from "../utils";

export async function buildProject() {
  const currentWorkspace = vscode.workspace.workspaceFolders![0];

  const buildTask = new vscode.Task(
    { type: "bavar", task: "build" },
    currentWorkspace,
    "Build the project",
    "LabAvrPlatform",
    new vscode.ProcessExecution("bavar", ["build", getIntegrationBackendFlag()], {
      cwd: currentWorkspace.uri.path,
    }),
    ["$gcc"]
  );

  vscode.tasks.executeTask(buildTask);
}

import * as vscode from "vscode";
import { getIntegrationBackendFlag } from "../utils";

export async function uploadProject() {
  const currentWorkspace = vscode.workspace.workspaceFolders![0];

  const uploadTask = new vscode.Task(
    { type: "bavar", task: "build" },
    currentWorkspace,
    "Upload the project",
    "LabAvrPlatform",
    new vscode.ProcessExecution(
      "bavar",
      ["build", "@upload", getIntegrationBackendFlag()],
      {
        cwd: currentWorkspace.uri.path,
      }
    ),
    ["$gcc"]
  );

  vscode.tasks.executeTask(uploadTask);
}

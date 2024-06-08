import * as vscode from "vscode";

export async function uploadProject() {
  const currentWorkspace = vscode.workspace.workspaceFolders![0];

  const buildTask = new vscode.Task(
    { type: "bavar", task: "build" },
    currentWorkspace,
    "Upload the project",
    "LabAvrPlatform",
    new vscode.ProcessExecution("bavar", ["build", "@upload", "-clangd"], {
      cwd: currentWorkspace.uri.path,
    }),
    []
  );

  vscode.tasks.executeTask(buildTask);
}

import * as vscode from "vscode";

export async function buildProject() {
  const currentWorkspace = vscode.workspace.workspaceFolders![0];

  const buildTask = new vscode.Task(
    { type: "bavar", task: "build" },
    currentWorkspace,
    "Build the project",
    "LabAvrPlatform",
    new vscode.ProcessExecution("bavar", ["build", "-clangd"], {
      cwd: currentWorkspace.uri.path,
    }),
    []
  );

  vscode.tasks.executeTask(buildTask);
}

import * as vscode from "vscode";

export async function uploadProject() {
  const currentWorkspace = vscode.workspace.workspaceFolders![0];

  const uploadTask = new vscode.Task(
    { type: "bavar", task: "build" },
    currentWorkspace,
    "Upload the project",
    "LabAvrPlatform",
    new vscode.ProcessExecution(
      "bavar",
      ["build", "@upload", "-c-cpp-properties"],
      {
        cwd: currentWorkspace.uri.path,
      }
    ),
    ["$gcc"]
  );

  vscode.tasks.executeTask(uploadTask);
}

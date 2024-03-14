import * as vscode from "vscode";
import { refreshProject } from "./commands/refresh";
import { newProject } from "./commands/new_project";

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, "labavrplatform" is now active!');

  refreshProject();

  context.subscriptions.push(
    vscode.commands.registerCommand("labavrplatform.refresh", refreshProject),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("labavrplatform.newProject", newProject),
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "labavrplatform.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from LabAvrPlatform!");
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

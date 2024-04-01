import * as vscode from "vscode";
import {
  checkInstalledToolchain,
  checkIsLabAvrProjectDir,
  CurrentToolchainEnv,
  VsCodeHelpers,
} from "../utils";
import { readFile } from "fs/promises";
import { LabAvrProjectConfigScheme } from "../labproject";
import { updateCExtProperties } from "../c_ext_integration";

export async function refreshProject() {
  checkInstalledToolchain();

  if (vscode.workspace.workspaceFolders) {
    const workspaceFolder = vscode.workspace.workspaceFolders[0];

    VsCodeHelpers.setContext(
      "isLabAvrProject",
      checkIsLabAvrProjectDir(workspaceFolder.uri.fsPath),
    );

    const config = LabAvrProjectConfigScheme.parse(
      JSON.parse(
        await readFile(
          `${workspaceFolder.uri.fsPath}/LabAvrProject.json`,
          "utf-8",
        ),
      ),
    );

    const currentToolchain = await CurrentToolchainEnv;

    await updateCExtProperties(config, currentToolchain, workspaceFolder);

    const updateCallback = async (event: unknown) => {
      console.log(event);

      await updateCExtProperties(config, currentToolchain, workspaceFolder);
    };

    vscode.workspace.onDidCreateFiles(updateCallback);
    vscode.workspace.onDidDeleteFiles(updateCallback);
    vscode.workspace.onDidRenameFiles(updateCallback);

    return;
  }

  VsCodeHelpers.setContext("isLabAvrProject", false);
}

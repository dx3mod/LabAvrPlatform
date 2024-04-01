import * as vscode from "vscode";
import {
  CurrentToolchainEnv,
  ProjectConfigFileName,
  VsCodeHelpers,
} from "../utils";
import { MCU_ALL_LIST } from "../mcus";
import * as fs from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function newProject() {
  await checkInstalledToolchain();

  let projectName = await askProjectName();

  if (!projectName) {
    return;
  }

  const projectKind = (await vscode.window.showQuickPick<ProjectKind>(
    [
      {
        label: "Firmware",
        detail: "Executable programme that is loaded into the microcontroller.",
        iconPath: new vscode.ThemeIcon("chip"),
      },
      {
        label: "Library",
        detail: "Reusable code for use in other projects.",
        iconPath: new vscode.ThemeIcon("library"),
      },
    ],
    {
      title: "Project Type",
    },
  ))?.label;

  if (!projectKind) {
    return;
  }

  const progLang = (await vscode.window.showQuickPick<ProgrammingLanguage>(
    [
      {
        label: "C",
        description: "optimal for most projects",
      },
      { label: "C++", description: "for rich logic programming" },
      {
        label: "Assembler",
        description: "experimental support",
      },
      {
        label: "Free Pascal",
        description: "not supported",
      },
    ],
    {
      title: "Выберите язык программирования",
    },
  ))?.label;

  if (!progLang || progLang === "Free Pascal") {
    return;
  }

  let targetMcu: string | undefined = undefined;
  let targetHz = undefined;

  if (projectKind === "Firmware") {
    targetMcu = await vscode.window.showQuickPick(MCU_ALL_LIST, {
      title: "Target MCU",
    });

    let mhz = (await vscode.window.showQuickPick(
      [
        { label: "1", description: "MHz" },
        { label: "4", description: "MHz" },
        { label: "8", description: "MHz" },
        { label: "16", description: "MHz" },
        { label: "Other" },
      ],
      { title: "Operating frequency of the MCU in MHz" },
    ))?.label;

    if (mhz === "Other") {
      vscode.window.showInformationMessage(
        "You can change the frequency of the MCU at any time.",
      );

      const hz = await vscode.window.showInputBox({
        title: "Operating frequency of the MCU in Hz",
        placeHolder: "5_863_021",
      });

      if (hz) {
        targetHz = Number.parseInt(hz.replace("_", ""));
      }
    } else if (mhz) {
      targetHz = Number.parseInt(mhz) * 1_000_000; // convert MHz into Hz
    }
  }

  const location = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    title: "Where to create a project?",
  });

  if (!location) {
    return;
  }

  ///////////////////////////////////////////////////////

  let projectLocation: string;
  for (;;) {
    if (!projectName) {
      vscode.window.showErrorMessage("You are crazy!", {
        detail: "Как можно было так ебануться, чувак...?",
        modal: true,
      });
      return;
    }

    projectLocation = join(location[0].fsPath, projectName);

    if (existsSync(projectLocation)) {
      const action = await vscode.window.showErrorMessage(
        `The '${projectLocation}' project already exist!`,
        "Rename",
      );

      if (action === "Rename") {
        projectName = await askProjectName();
        continue;
      }
    }

    break;
  }

  await fs.mkdir(projectLocation);
  process.chdir(projectLocation);

  await fs.mkdir("src/");

  if (projectKind === "Firmware") {
    if (progLang === "Assembler") {
      // TODO: implement main.s creating
    } else {
      const fileExt = progLang === "C" ? "c" : "cpp";

      fs.writeFile(
        `src/main.${fileExt}`,
        `#include <avr/io.h>

int main(void) {
  while (1) {
  }
}`,
      );
    }
  } else { // Library
    // TODO: implement library project type creating
  }

  // mock
  fs.writeFile(
    ProjectConfigFileName,
    JSON.stringify(
      {
        name: projectName,
        target: targetMcu ? { mcu: targetMcu, hz: targetHz } : undefined,
      },
      null,
      2,
    ),
  );

  const action = await vscode.window.showInformationMessage(
    "The project was successfully set up. Open it?",
    "Open",
  );

  if (action === "Open") {
    await VsCodeHelpers.openFolder(projectLocation);
  }
}

async function askProjectName() {
  return await vscode.window.showInputBox({
    title: "Project Name",
    placeHolder: "some-new-cool-blink-project",
    value: "blink",
  });
}

async function checkInstalledToolchain() {
  const toolchainEnv = await CurrentToolchainEnv;

  if (!toolchainEnv.compilerPath && !toolchainEnv.programmerPath) {
    vscode.window.showWarningMessage(
      "Not installed toolchain for development under AVR!",
      "Install",
    );
    return;
  }

  if (!toolchainEnv.compilerPath) {
    vscode.window.showWarningMessage(
      "Not installed AVR GCC toolchain!",
      "Install",
    );
  }

  if (!toolchainEnv.programmerPath) {
    vscode.window.showWarningMessage(
      "Not installed AVRDUDE programmer!",
      "Install",
    );
  }
}

interface ProjectKind extends vscode.QuickPickItem {
  label: "Firmware" | "Library";
}

interface ProgrammingLanguage extends vscode.QuickPickItem {
  label: "C" | "C++" | "Assembler" | "Free Pascal";
}

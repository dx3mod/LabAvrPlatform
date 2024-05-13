import ProjectUnits from "./project_units";
import { AvrProjectSolution, AvrProjectSolutionSchema } from "./solution";
import fs from "fs/promises";
import path from "path";
import RequireMacro from "./require_macro";
import { existsSync } from "fs";
import { glob } from "glob";

const SOURCE_FILE_EXTS = new RegExp(`\.(c|cpp|cxx|s|asm)$`);
const OBJECT_FILE_EXTS = new RegExp(`\.o$`);
const HEADER_FILE_EXTS = new RegExp(`\.(h|hpp|hxx)$`);
const ATTACHMENTS_FILE_EXTS = new RegExp(`\.(bin|txt)$`);

export class AvrProject {
  public readonly units: ProjectUnits;
  private readonly requireReferences: Map<string, RequireMacro>;

  constructor(
    public readonly rootDir: string,
    public readonly solution: AvrProjectSolution
  ) {
    this.units = new ProjectUnits();
    this.requireReferences = new Map();
  }

  async resolve() {
    // NOTE: here performance dies

    const ignore = [`${this.artifactsDir}/**`, ...this.solution.excludes];

    const convert = (filename: string): [string, path.ParsedPath] => [
      filename,
      path.parse(filename),
    ];

    const sources = await glob(`**/*.{c,cxx,cpp}`, {
      cwd: this.sourceDir,
      absolute: true,
      ignore,
    });

    const headers = (
      await glob(`**/*.{h,hpp,hxx}`, {
        cwd: this.sourceDir,
        absolute: true,
        ignore,
      })
    ).map(convert);

    if (this.solution.singleNamespace) {
      for (const filename of sources) {
        const parsedPath = path.parse(filename);

        const headerOfFile = headers.find(
          ([_, { name }]) => parsedPath.name === name
        );

        if (headerOfFile) {
          this.units.includes.push(headerOfFile[0]);
          this.units.passes.push(filename);
        } else {
          this.units.includes.push(filename);
        }
      }

      for (const [filename, _] of headers) {
        if (!this.units.includes.includes(filename))
          this.units.includes.push(filename);
      }
    } else {
      this.units.passes.push(...sources);
      this.units.headers.push(...headers.map(([filename, _]) => filename));
    }

    if (this.solution.resolveImports)
      for (const filename of sources) {
        await this.resolveRequires(await getRequires(filename));
      }
  }

  async resolveRequires(requires: RequireMacro[]) {
    for (const requireMacro of requires) {
      if (!this.solution.requireMacros) continue;

      const filePath = path.parse(requireMacro.file);

      const resourcePath =
        requireMacro.resourcePath.startsWith("./") ||
        requireMacro.resourcePath.startsWith("../")
          ? path.join(filePath.dir, requireMacro.resourcePath)
          : path.join(this.rootDir, requireMacro.resourcePath);

      if (this.requireReferences.has(resourcePath)) continue;

      if (!existsSync(resourcePath))
        throw new Error(`Not found '${resourcePath}'`);

      const resourceStat = await fs.stat(resourcePath);

      if (resourceStat.isDirectory()) {
        const configFilePath = path.join(resourcePath, "LabAvrProject.json");

        if (existsSync(configFilePath))
          await this.requireAvrProject(resourcePath);
        else {
          await this.requireExternalLibrary(resourcePath, false);
        }
      }

      if (!resourceStat.isFile()) continue;

      if (resourcePath.match(HEADER_FILE_EXTS)) {
        const resourcePathDir = path.parse(resourcePath).dir;

        if (!resourcePathDir.startsWith(this.sourceDir))
          await this.requireExternalLibrary(resourcePathDir, true);

        if (requireMacro.kind === "require")
          if (this.solution.singleNamespace)
            this.units.headers.push(resourcePath);
          else this.units.includes.push(resourcePath);
      } else if (resourcePath.match(ATTACHMENTS_FILE_EXTS)) {
        await this.requireAttachment(resourcePath);
      } else {
        console.log(`Not support '${resourcePath}' requiring!`);
      }

      this.requireReferences.set(resourcePath, requireMacro);
    }
  }

  async requireAvrProject(rootDir: string) {
    const configFilePath = path.join(rootDir, "LabAvrProject.json");

    if (!existsSync(configFilePath))
      throw new Error(`Not found LabAvrProject.json at '${configFilePath}'!`);

    const solution = AvrProjectSolutionSchema.parse(
      JSON.parse(await fs.readFile(configFilePath, { encoding: "utf8" }))
    );

    const builder = new AvrProject(rootDir, solution);
    await builder.resolve();

    this.units.extends(builder.units);
  }

  async requireExternalLibrary(rootDir: string, byHeader: boolean) {
    if (!byHeader) {
      const sourceDirs = await glob("{src,Src,Sources,source}/", {
        cwd: rootDir,
      });

      if (sourceDirs) rootDir = path.join(rootDir, sourceDirs[0]);
    }

    const sources = await glob("*.{c,cxx,cpp}", {
      cwd: rootDir,
      absolute: true,
      ignore: ["examples", "example", "tests", "test", "docs"],
    });

    this.units.passes.push(...sources);
  }

  async requireAttachment(filename: string) {
    this.units.attachments.push({ kind: "bin", path: filename });
  }

  get sourceDir() {
    return path.resolve(path.join(this.rootDir, this.solution.rootDir));
  }

  get artifactsDir() {
    return path.join(this.rootDir, this.solution.outDir);
  }
}

async function getRequires(filename: string) {
  const contents = await fs.readFile(filename, { encoding: "utf8" });

  const requires = Array.from(
    contents.matchAll(/^\s*require\s*\(\s*".+"\s*\)/gm)
  ).map((x) => new RequireMacro("require", x[0], filename));

  const includes = Array.from(contents.matchAll(/^\s*#include\s*".+"/gm)).map(
    (x) => new RequireMacro("include", x[0], filename)
  );

  return requires.concat(includes);
}

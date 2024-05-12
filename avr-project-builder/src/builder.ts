import path from "node:path";
import { AvrProjectSolution } from "./solution";
import fs from "node:fs/promises";
import RequireMacro from "./require_macro";

type ProjectUnits = Readonly<{
  sources: string[];
  headers: string[];
  requires: RequireMacro[];
}>;

const SOURCE_FILE_EXTS = new RegExp(`\.(c|cpp|cxx|s|asm)$`);
const HEADER_FILE_EXTS = new RegExp(`\.(h|hpp|hxx)$`);

export class AvrProjectBuilder {
  constructor(public readonly solution: AvrProjectSolution) {}

  async resolveProjectFiles(): Promise<ProjectUnits> {
    const units: ProjectUnits = { sources: [], headers: [], requires: [] };

    // meh filterMap
    const dir = fs.opendir(this.solution.rootDir, { recursive: true });
    for await (const entry of await dir) {
      if (entry.isFile()) {
        const entryPath = path.join(entry.parentPath, entry.name);

        const isSourceFileMatch = entry.name.match(SOURCE_FILE_EXTS);
        const isHeaderFileMatch = entry.name.match(HEADER_FILE_EXTS);

        if (isSourceFileMatch) {
          units.sources.push(entryPath);
        } else if (isHeaderFileMatch) {
          units.headers.push(entryPath);
        }

        if (isHeaderFileMatch || isSourceFileMatch)
          units.requires.push(...(await getRequires(entryPath)));
      }
    }

    return units;
  }
}

async function getRequires(filename: string) {
  const contents = await fs.readFile(filename, { encoding: "utf8" });

  const requires = Array.from(
    contents.matchAll(/$\s*require\s*\(\s*".+"\s*\)\s*^/gm)
  ).map((x) => new RequireMacro("require", x[0], filename));

  const includes = Array.from(
    contents.matchAll(/$\s*#include\s*".+"\s*^/gm)
  ).map((x) => new RequireMacro("include", x[0], filename));

  return requires.concat(includes);
}

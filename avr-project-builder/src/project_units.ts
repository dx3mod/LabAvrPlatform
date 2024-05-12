export default class ProjectUnits {
  public readonly includes: string[];
  public readonly passes: string[];
  public readonly headers: string[];

  constructor() {
    this.includes = [];
    this.passes = [];
    this.headers = [];
  }

  extends(units: ProjectUnits) {
    this.includes.push(...units.includes);
    this.passes.push(...units.passes);
    this.headers.push(...units.headers);
  }
}

import { Attachment } from "./attachment";

export default class ProjectUnits {
  public readonly includes: string[];
  public readonly passes: string[];
  public readonly headers: string[];
  public readonly attachments: Attachment[];

  constructor() {
    this.includes = [];
    this.passes = [];
    this.headers = [];
    this.attachments = [];
  }

  extends(units: ProjectUnits) {
    this.includes.push(...units.includes);
    this.passes.push(...units.passes);
    this.headers.push(...units.headers);
    this.attachments.push(...units.attachments);
  }
}

export default class RequireMacro {
  public readonly resourcePath: string;

  constructor(
    public readonly kind: "include" | "require",
    public readonly original: string,
    public readonly file: string
  ) {
    this.resourcePath = original.match(/".+"/)![0].slice(1, -1);
  }
}

export class IFrameContainer {
  public containerElement: HTMLElement | null;

  constructor(public merchantUrl: string) {
    let element = document.getElementById(`__${merchantUrl}__`);
    if (!element) {
      element = document.createElement("div");
      element.id = `__${merchantUrl}__`;
      element.tabIndex = -1;
      element.setAttribute("style", "display: none;");
      document.body.appendChild(element);
    }

    this.containerElement = element;
  }

  public hideIFrame() {
    this.containerElement?.setAttribute("style", "display: none;");
  }

  public showIFrame() {
    this.containerElement?.setAttribute("style", "display: block;");
  }

  public destroyChildrens() {
    //@ts-ignore
    this.containerElement?.innerHTML = "";
  }
}

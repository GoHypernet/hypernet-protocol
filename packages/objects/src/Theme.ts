import { Palette } from "@objects/Palette";

export class Theme {
  constructor(public light: Palette | null, public dark: Palette | null) {}
}

type TypeDivider = string;

interface TypeText {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
}

export interface PaletteColorOptions {
  light?: string;
  main: string;
  dark?: string;
  contrastText?: string;
}

export interface Palette {
  primary: PaletteColorOptions;
  text?: Partial<TypeText>;
  divider?: TypeDivider;
}

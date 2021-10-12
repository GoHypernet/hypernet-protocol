import { makeStyles } from "@material-ui/core";
import { EFontWeight } from "@web-ui/theme";

interface IChipColorCodes {
  color: string;
  backgroundColor: string;
}
export const useStyles = makeStyles(() => ({
  chip: ({ color, backgroundColor }: IChipColorCodes) => ({
    borderRadius: 3,
    color,
    backgroundColor,
    fontWeight: EFontWeight.MEDIUM,
  }),
}));

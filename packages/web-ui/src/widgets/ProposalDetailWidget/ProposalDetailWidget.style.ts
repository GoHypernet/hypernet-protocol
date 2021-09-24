import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  proposerSectionWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  proposerLabel: {
    fontWeight: EFontWeight.MEDIUM,
  },
  proposerValue: {
    marginLeft: 16,
    color: colors.GREEN700,
  },
  proposalDetails: {
    marginTop: 28,
    backgroundColor: colors.GRAY100,
    border: `1px solid ${colors.GRAY200}`,
    borderRadius: 3,
    padding: 16,
  },
  proposalDetailsLabel: {
    fontWeight: EFontWeight.MEDIUM,
    paddingBottom: 24,
  },
});

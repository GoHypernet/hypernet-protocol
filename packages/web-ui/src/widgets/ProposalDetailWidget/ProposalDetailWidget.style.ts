import { makeStyles } from "@material-ui/core";

import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  sectionWrapper: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  sectionLabel: {
    fontWeight: EFontWeight.MEDIUM,
    minWidth: 100,
  },
  sectionValue: {
    marginLeft: 16,
    color: colors.GREEN700,
  },
  proposalDetails: {
    marginTop: 28,
    backgroundColor: colors.GRAY100,
    border: `1px solid ${colors.GRAY300}`,
    borderRadius: 3,
    padding: 16,
  },
  proposalDetailsLabel: {
    fontWeight: EFontWeight.MEDIUM,
    paddingBottom: 24,
  },
  proposalStatus: {
    marginBottom: 40,
  },
});

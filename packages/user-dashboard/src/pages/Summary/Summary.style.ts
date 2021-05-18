import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
  },
  leftContent: {
    flex: 2,
    marginRight: 24,
  },
  rightContent: {
    flex: 1,
    "& > div:first-child": {
      marginBottom: 24,
    },
  },
});

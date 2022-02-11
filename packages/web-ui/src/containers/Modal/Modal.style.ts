interface IStyleProps {
  modalWidth: number;
}

import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 400,
  },
  wrapper: {
    position: "absolute",
    background: colors.GRAY100,
    padding: "30px 20px",
    textAlign: "center",
    top: "50%",
    left: "50%",
    display: "flex",
    justifyContent: "center",
    borderRadius: 4,
    transform: "translate(-50%, -50%)",
    boxShadow: "0px 4px 20px #000000",
    width: (props: IStyleProps) => props.modalWidth,
  },
  closeIcon: {
    position: "absolute",
    right: 24,
    marginRight: 10,
    cursor: "pointer",
    top: 38,
  },
  bottomText: {
    alignSelf: "flex-end",
    color: colors.GRAY700,
    marginTop: 24,
  },
});

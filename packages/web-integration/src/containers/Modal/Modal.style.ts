import { createUseStyles } from "react-jss";

interface IStyleProps {
  modalWidth: number;
}

const useStyles = createUseStyles<any, IStyleProps>({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    fontFamily: '"Montserrat", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    fontWeight: 400,
  },
  wrapper: {
    position: "absolute",
    background: "white",
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
    right: 5,
    marginRight: 10,
    cursor: "pointer",
    top: 37,
  },
});

export default useStyles;

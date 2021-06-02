import { withStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";

export const CustomSlider = withStyles({
  root: {
    color: "#9A9A9A",
    padding: "13px 0",
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -10,
    marginLeft: -13,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px",
    },
    "& .bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  track: {
    height: 9,
  },
  rail: {
    color: "#9A9A9A",
    borderRadius: 5,
    opacity: 0.5,
    height: 9,
  },
})(Slider);

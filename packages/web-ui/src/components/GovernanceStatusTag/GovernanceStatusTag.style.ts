import { makeStyles } from "@material-ui/core";
import { IStatusConfig } from "@web-ui/components/GovernanceStatusTag";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: { config: IStatusConfig }) => ({
    padding: "8px 12px",
    width: 68, //92,
    display: "flex",
    justifyContent: "center",
    backgroundColor: props.config.backgroundColor,
    borderRadius: 3,
    border: `1px solid ${props.config.borderColor}`,
  }),
  text: (props: { config: IStatusConfig }) => ({
    color: props.config.textColor,
    lineHeight: "15.93px",
  }),
}));

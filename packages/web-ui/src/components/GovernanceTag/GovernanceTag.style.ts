import { makeStyles } from "@material-ui/core";
import { ITagConfig } from "@web-ui/components/GovernanceTag";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: { config: ITagConfig }) => ({
    padding: "8px 12px",
    width: 68, //92,
    display: "flex",
    justifyContent: "center",
    backgroundColor: props.config.backgroundColor,
    borderRadius: 3,
    border: `1px solid ${props.config.borderColor}`,
  }),
  text: (props: { config: ITagConfig }) => ({
    color: props.config.textColor,
    lineHeight: "15.93px",
  }),
}));

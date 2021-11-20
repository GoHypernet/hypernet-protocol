import {
  Avatar,
  Box,
  Card,
  Radio,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { colors } from "@web-ui/theme";
import React, { ReactNode, CSSProperties, useState } from "react";

export interface IStep {
  label: string;
  optional?: boolean;
  content: any;
}

interface OptionCardProps {
  label: string;
  value?: string;
  iconSrc?: string;
  iconComponent?: ReactNode;
  onClick?: () => void;
  selected: boolean;
  style?: CSSProperties;
  endComponent?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      border: `1px solid ${colors.GRAY200}`,
      cursor: "pointer",
    },
    iconStyle: {
      backgroundColor: "#FFFFFF",
      marginRight: 18,
    },
  }),
);
const OptionCard: React.FunctionComponent<OptionCardProps> = (
  props: OptionCardProps,
) => {
  const {
    label,
    value,
    iconSrc,
    iconComponent,
    onClick,
    selected,
    style,
    endComponent,
  } = props;
  const classes = useStyles({ selected });
  const [elevation, setElevation] = useState(2);
  return (
    <Card
      elevation={0}
      className={classes.root}
      style={style}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <Radio style={{ marginRight: 32 }} color="primary" checked={selected} />
      {iconComponent ? (
        <Avatar alt="Radio Icon" className={classes.iconStyle}>
          {iconComponent}
        </Avatar>
      ) : (
        <Avatar alt="Radio Icon" className={classes.iconStyle} src={iconSrc} />
      )}
      <Box>
        <Tooltip title={label} placement="top">
          <Box
            display="flex"
            alignItems="center"
            style={{
              height: 24,
              overflow: "hidden",
              marginRight: 8,
            }}
          >
            <Typography variant="h3">{`${label
              ?.charAt(0)
              .toUpperCase()}${label?.slice(1)}`}</Typography>
          </Box>
        </Tooltip>
      </Box>
      {endComponent && <Box marginLeft="auto">{endComponent}</Box>}
    </Card>
  );
};

export default OptionCard;

import React from "react";
import {
  GovernanceListItem,
  GovernanceButton,
  IGovernanceButton,
  GovernanceChip,
} from "@web-ui/components";
import { GovernanceListItemValueWithTitle } from "@web-integration/index";
import { Box, Grid } from "@material-ui/core";
import { useStyles } from "@web-ui/components/GovernanceRegistryListItem/GovernanceRegistryListItem.style";

interface IFieldWithValueList {
  fieldTitle: string;
  fieldValue?: string;
  fullWidth?: boolean;
}

export interface IRegistryListItemAction extends IGovernanceButton {
  label: string;
}

interface GovernanceRegistryListItemProps {
  number: string;
  title: string;
  fieldWithValueList: IFieldWithValueList[];
  actionButtonList?: IRegistryListItemAction[];
  chipItemList?: string[];
}

export const GovernanceRegistryListItem: React.FC<GovernanceRegistryListItemProps> =
  (props: GovernanceRegistryListItemProps) => {
    const {
      number,
      title,
      fieldWithValueList,
      actionButtonList = [],
      chipItemList = [],
    } = props;
    const classes = useStyles();

    return (
      <GovernanceListItem
        number={number}
        title={title}
        rightContent={actionButtonList.map(
          (
            {
              onClick,
              label,
              variant = "contained",
              size = "small",
              ...rest
            }: IRegistryListItemAction,
            index: number,
          ) => (
            <GovernanceButton
              style={{ marginLeft: 16 }}
              onClick={onClick}
              variant={variant}
              size={size}
              key={index}
              {...rest}
            >
              {label}
            </GovernanceButton>
          ),
        )}
      >
        <Grid container spacing={3}>
          {fieldWithValueList.map(
            ({ fieldTitle, fieldValue, fullWidth }, index) => (
              <Grid
                key={index}
                className={classes.gridItem}
                item
                xs={fullWidth ? 12 : 6}
              >
                {fieldValue && (
                  <GovernanceListItemValueWithTitle
                    title={fieldTitle}
                    value={fieldValue}
                  />
                )}
              </Grid>
            ),
          )}
        </Grid>

        {chipItemList.length > 0 && (
          <Grid container spacing={1}>
            {chipItemList.map((item, index) => (
              <Grid key={index} item>
                <GovernanceChip label={item} color="orange" size="small" />
              </Grid>
            ))}
          </Grid>
        )}
      </GovernanceListItem>
    );
  };

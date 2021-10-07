import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Field as FormikField, FieldAttributes, FieldProps } from "formik";
import { useStyles } from "@web-ui/components/GovernanceDialogSelectLargeField/GovernanceDialogSelectLargeField.style";

export interface GovernanceDialogSelectLargeFieldProps extends FieldAttributes<any> {
  title?: string;
  options?: IGovernanceDialogSelectLargeFieldOption[];
}

export interface IGovernanceDialogSelectLargeFieldOption {
  primaryText?: string;
  secondaryText?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  value: any;
}

export const GovernanceDialogSelectLargeField: React.FC<GovernanceDialogSelectLargeFieldProps> =
  (props: GovernanceDialogSelectLargeFieldProps) => {
    const { title, required, options } = props;
    const classes = useStyles({});
    const titleText = `${title}${required ? " *" : ""}`;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleDialogOpen = () => {
      setIsDialogOpen((open) => !open);
    };

    return (
      <>
        <Box className={classes.wrapper} onClick={toggleDialogOpen}>
          {title && (
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.title}
            >
              {titleText}
            </Typography>
          )}
          <FormikField className={classes.field} {...props}>
            {({ field, form, meta }: FieldProps) => {
              return (
                <>
                  <Box className={classes.fieldTextWrapper}>
                    <Typography variant="body2">
                      {
                        options?.find((option) => option.value === field.value)
                          ?.primaryText
                      }
                    </Typography>
                    <KeyboardArrowDownIcon />
                  </Box>

                  <Dialog
                    open={isDialogOpen}
                    onClose={() => {
                      setIsDialogOpen(false);
                    }}
                    fullWidth
                    maxWidth="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DialogTitle>
                      <Box className={classes.dialogTitle}>
                        {titleText}
                        <IconButton
                          aria-label="close"
                          onClick={() => {
                            setIsDialogOpen(false);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </DialogTitle>
                    <Divider />
                    <List className={classes.list}>
                      {options?.map((option, index) => (
                        <ListItem
                          key={index}
                          className={classes.listItem}
                          button
                          onClick={() => {
                            form.setFieldValue(props.name, option.value);
                            setIsDialogOpen(false);
                          }}
                        >
                          {option.icon && (
                            <ListItemAvatar>
                              <Avatar>{option.icon}</Avatar>
                            </ListItemAvatar>
                          )}

                          <ListItemText
                            {...(option.primaryText && {
                              primary: option.primaryText,
                            })}
                            {...(option.secondaryText && {
                              secondary: option.secondaryText,
                            })}
                          />
                          {option.action && (
                            <ListItemSecondaryAction>
                              {option.action}
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Dialog>
                </>
              );
            }}
          </FormikField>
        </Box>
      </>
    );
  };

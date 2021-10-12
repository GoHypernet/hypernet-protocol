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
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@material-ui/icons";
import { Field as FormikField, FieldAttributes, FieldProps } from "formik";
import { useStyles } from "@web-ui/components/GovernanceDialogSelectField/GovernanceDialogSelectField.style";

export interface GovernanceDialogSelectFieldProps extends FieldAttributes<any> {
  title?: string;
  dialogTitle?: string;
  options?: IGovernanceDialogSelectFieldOption[];
}

export interface IGovernanceDialogSelectFieldOption {
  primaryText?: string;
  secondaryText?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  value: any;
}

export const GovernanceDialogSelectField: React.FC<GovernanceDialogSelectFieldProps> =
  (props: GovernanceDialogSelectFieldProps) => {
    const { title, dialogTitle, required, options } = props;
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
                        <IconButton
                          aria-label="close"
                          onClick={() => {
                            setIsDialogOpen(false);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        {dialogTitle || titleText}
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

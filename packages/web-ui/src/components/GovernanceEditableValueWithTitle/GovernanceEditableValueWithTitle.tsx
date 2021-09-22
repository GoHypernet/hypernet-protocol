import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { Form, Formik, FormikValues } from "formik";

import {
  GovernanceLargeField,
  GovernanceValueWithTitle,
} from "@web-integration/components";

import { useStyles } from "@web-ui/components/GovernanceEditableValueWithTitle/GovernanceEditableValueWithTitle.style";

interface IGovernanceEditableValueWithTitle {
  title: string;
  value: string;

  // These should come from ValueWithTitle props interface
  titleRightContent?: React.ReactNode;
  valueRightContent?: React.ReactNode;
  showCopy?: boolean;
  onSave: (value: string) => void;
}

export const GovernanceEditableValueWithTitle: React.FC<IGovernanceEditableValueWithTitle> =
  (props: IGovernanceEditableValueWithTitle) => {
    const {
      title,
      value,
      titleRightContent,
      valueRightContent,
      showCopy,
      onSave,
    } = props;

    const classes = useStyles({});
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);
    const isMounted = useRef(false);

    useEffect(() => {
      if (isMounted.current) {
        onSave(fieldValue);
      } else {
        isMounted.current = true;
      }
    }, [fieldValue]);

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleSaveClick = (values: FormikValues) => {
      setFieldValue(values[title]);
      setIsEditing(false);
    };

    return (
      <Box>
        {isEditing ? (
          <Formik
            initialValues={{
              [title]: fieldValue,
            }}
            onSubmit={handleSaveClick}
          >
            {({ handleSubmit, values }) => (
              <Form onSubmit={handleSubmit}>
                <GovernanceLargeField
                  title={title}
                  name={title}
                  rightContent={
                    <IconButton
                      className={classes.saveButton}
                      onClick={() => {
                        handleSaveClick(values);
                      }}
                    >
                      <SaveIcon />
                    </IconButton>
                  }
                  focus
                />
              </Form>
            )}
          </Formik>
        ) : (
          <GovernanceValueWithTitle
            title={title}
            value={fieldValue}
            titleRightContent={titleRightContent}
            valueRightContent={valueRightContent}
            showCopy={showCopy}
            onEditClick={handleEditClick}
          />
        )}
      </Box>
    );
  };

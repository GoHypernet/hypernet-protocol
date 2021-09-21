import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Form, Formik, FormikValues } from "formik";

import { IRenderParams } from "@web-ui/interfaces";
import {
  GovernanceLargeField,
  ValueWithTitle,
} from "@web-integration/components";

interface IRegistryFieldWidget extends IRenderParams {
  title: string;
  value: string;
  editable?: boolean;

  // These should come from ValueWithTitle props interface
  titleRightContent?: React.ReactNode;
  valueRightContent?: React.ReactNode;
  showCopy?: boolean;
}

export const RegistryFieldWidget: React.FC<IRegistryFieldWidget> = (
  props: IRegistryFieldWidget,
) => {
  const {
    title,
    value,
    editable,
    titleRightContent,
    valueRightContent,
    showCopy,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (values: FormikValues) => {
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
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <GovernanceLargeField
                title={title}
                name={title}
                onSaveClick={handleSubmit}
                focus
              />
            </Form>
          )}
        </Formik>
      ) : (
        <ValueWithTitle
          title={title}
          value={fieldValue}
          titleRightContent={titleRightContent}
          valueRightContent={valueRightContent}
          showCopy={showCopy}
          {...(editable && {
            onEditClick: handleEditClick,
          })}
        />
      )}
    </Box>
  );
};

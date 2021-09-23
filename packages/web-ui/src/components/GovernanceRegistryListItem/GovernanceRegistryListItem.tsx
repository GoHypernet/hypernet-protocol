import React from "react";
import { GovernanceListItem, GovernanceButton } from "@web-ui/components";
import { GovernanceListItemValueWithTitle } from "@web-integration/index";
import { Box } from "@material-ui/core";

interface IFieldWithValueList {
  fieldTitle: string;
  fieldValue?: string;
}

interface GovernanceRegistryListItemProps {
  number: string;
  title: string;
  onViewDetailsClick: () => void;
  fieldWithValueList: IFieldWithValueList[];
  buttonLabel?: string;
}

export const GovernanceRegistryListItem: React.FC<GovernanceRegistryListItemProps> =
  (props: GovernanceRegistryListItemProps) => {
    const {
      number,
      title,
      fieldWithValueList,
      onViewDetailsClick,
      buttonLabel,
    } = props;

    return (
      <GovernanceListItem
        number={number}
        title={title}
        rightContent={
          <GovernanceButton
            onClick={onViewDetailsClick}
            variant="contained"
            size="medium"
          >
            {buttonLabel || "View Details"}
          </GovernanceButton>
        }
      >
        {fieldWithValueList.map((fieldWithValue, index) => (
          <Box key={index}>
            {fieldWithValue.fieldValue && (
              <GovernanceListItemValueWithTitle
                title={fieldWithValue.fieldTitle}
                value={fieldWithValue.fieldValue}
              />
            )}
          </Box>
        ))}
      </GovernanceListItem>
    );
  };

import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { TextField, Typography } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import { useStyles } from "@web-ui/components/GovernanceAutocomplete/GovernanceAutocomplete.style";
import { GovernanceCheckbox } from "@web-ui/components/GovernanceCheckbox";

export interface IGovernanceAutocompleteOption {
  label: string;
  value: any;
}

type AutocompletePropsExtacted = Omit<
  AutocompleteProps<
    any,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
  "renderInput"
>;

interface IGovernanceAutocompleteProps extends AutocompletePropsExtacted {
  title?: string;
  options: IGovernanceAutocompleteOption[];
  handleChange: (selectedValues: any) => void;
  multiple?: boolean;
}

export const GovernanceAutocomplete: React.FC<IGovernanceAutocompleteProps> = ({
  title,
  options,
  handleChange,
  multiple,
  ...rest
}: IGovernanceAutocompleteProps) => {
  const classes = useStyles();

  return (
    <Autocomplete
      options={options}
      multiple={multiple}
      disableCloseOnSelect
      renderOption={(option, { selected }) => (
        <>
          <GovernanceCheckbox
            size="small"
            color="primary"
            className={classes.checkbox}
            checked={selected}
          />
          {option.label}
        </>
      )}
      getOptionLabel={(option) => option.label}
      ChipProps={{
        deleteIcon: <CloseIcon />,
      }}
      onChange={(_e, value) => {
        handleChange(value);
      }}
      renderInput={(params) => (
        <>
          {title && (
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.title}
            >
              {title}
            </Typography>
          )}
          <TextField variant="outlined" {...params} />
        </>
      )}
      {...rest}
    />
  );
};

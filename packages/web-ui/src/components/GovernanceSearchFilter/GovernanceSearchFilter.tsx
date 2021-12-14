import React, { useState } from "react";
import { Box, TextField } from "@material-ui/core";
import {
  Search as FilterSearchIcon,
  Refresh as FilterRefreshIcon,
} from "@material-ui/icons";

import { useStyles } from "@web-ui/components/GovernanceSearchFilter/GovernanceSearchFilter.style";

interface GovernanceSearchFilterProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSearchClick: (value: string) => void;
  onRestartClick: () => void;
  placeholder?: string;
  disabled?: boolean;
  title: string;
}

export const GovernanceSearchFilter: React.FC<GovernanceSearchFilterProps> = ({
  initialValue = "",
  onChange,
  onSearchClick,
  onRestartClick,
  placeholder,
  disabled,
  title,
}: GovernanceSearchFilterProps) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setSearchValue(event?.target?.value);
    onChange && onChange(event?.target?.value);
  };

  const onSearchIconClick = () => {
    onSearchClick(searchValue);
  };

  const onRestartIconClick = () => {
    setSearchValue("");
    onRestartClick();
  };

  return (
    <Box className={classes.wrapper}>
      <TextField
        title={title}
        className={classes.textFieldWrapper}
        placeholder={placeholder}
        variant="standard"
        value={searchValue}
        onChange={handleChange}
        disabled={disabled}
        size="small"
        InputProps={{
          disableUnderline: true,
        }}
      />
      <Box
        className={classes.iconClass}
        marginLeft={1}
        onClick={onSearchIconClick}
      >
        <FilterSearchIcon />
      </Box>
      <Box
        className={classes.iconClass}
        marginLeft={1}
        onClick={onRestartIconClick}
      >
        <FilterRefreshIcon />
      </Box>
    </Box>
  );
};

import {
  Box,
  SwipeableDrawer,
  Typography,
  Chip,
  TextField,
  Button,
  FormGroup,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { ISideFilterProps, EItemType } from "@web-ui/interfaces";
import React, { useEffect, useState } from "react";

import { theme, useStyles } from "./SideFilter.style";

import { SliderRange } from "@web-ui/components";

export const SideFilter: React.FC<ISideFilterProps> = (
  props: ISideFilterProps,
) => {
  const classes = useStyles();
  const {
    visible,
    onClose,
    itemsCount = -1,
    filterItems,
    onFilterSubmit,
  } = props;
  const [filterValues, setFilterValues] = useState({});

  const setDefaultFilterValues = () => {
    const defaultFilterValues = filterItems.reduce((acc, item) => {
      if (item.widgetType === EItemType.dateTimeDifference) {
        acc[`${item.stateKey}From`] = item.defaultValue;
        acc[`${item.stateKey}To`] = null;
      } else {
        acc[item.stateKey] = item.defaultValue;
      }
      return acc;
    }, {});
    setFilterValues(defaultFilterValues);
    return defaultFilterValues;
  };

  useEffect(() => {
    setDefaultFilterValues();
  }, []);

  const closeDrawer = () => {
    onClose();
  };

  const handleClickCancel = () => {
    closeDrawer();
  };

  const handleFilterSubmit = () => {
    onFilterSubmit({ ...filterValues });
    onClose();
  };

  const changeFilterValues = (key, value) => {
    setFilterValues({
      ...filterValues,
      [key]: value,
    });
  };

  const Header = (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classes.header}
    >
      <Box display="flex" alignItems="baseline">
        <Typography className={classes.headerLabel}>Filter</Typography>
        {itemsCount > -1 && (
          <Typography className={classes.headerInfo}>
            {itemsCount} results
          </Typography>
        )}
      </Box>
      <IconButton
        aria-label="close"
        onClick={handleClickCancel}
        className={classes.headerIconWrapper}
      >
        <CloseIcon className={classes.headerIcon} />
      </IconButton>
    </Box>
  );

  const Body = (
    <Box className={classes.body}>
      {filterItems.map(
        ({ widgetType, widgetProps, label, stateKey }, index: number) => {
          switch (widgetType) {
            case EItemType.chip:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  {widgetProps?.chipItems &&
                    widgetProps.chipItems.map((chipItem, itemIndex) => (
                      <Chip
                        className={`${classes.filterChipItem} ${
                          chipItem.value === filterValues[stateKey] &&
                          classes.filterChipItemSelected
                        }`}
                        key={itemIndex}
                        label={chipItem.label}
                        onClick={() =>
                          changeFilterValues(stateKey, chipItem.value)
                        }
                      />
                    ))}
                </Box>
              );

            case EItemType.rangeSlider:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  <SliderRange
                    value={filterValues[stateKey]}
                    onChangeCommitted={(e, value: number | number[]) => {
                      changeFilterValues(stateKey, value);
                    }}
                    min={widgetProps?.minValue}
                    max={widgetProps?.maxValue}
                  />
                </Box>
              );

            case EItemType.stringInput:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  <TextField
                    placeholder="Filter Data"
                    variant="filled"
                    fullWidth
                    value={filterValues[stateKey]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.persist();
                      changeFilterValues(stateKey, event?.target?.value);
                    }}
                    size="small"
                    className={classes.searchContainer}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <SearchIcon className={classes.searchIcon} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              );

            case EItemType.dateTime:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  <TextField
                    id="datetime-local"
                    type="datetime-local"
                    value={filterValues[stateKey]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.persist();
                      changeFilterValues(stateKey, event?.target?.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              );

            case EItemType.dateTimeDifference:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  <Box marginBottom={1}>
                    <TextField
                      id="datetime-local-from"
                      type="datetime-local"
                      value={filterValues[`${stateKey}From`]}
                      label="from"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        event.persist();
                        changeFilterValues(
                          `${stateKey}From`,
                          event?.target?.value,
                        );
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  <TextField
                    id="datetime-local-to"
                    type="datetime-local"
                    value={filterValues[`${stateKey}To`]}
                    label="to"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.persist();
                      changeFilterValues(`${stateKey}To`, event?.target?.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              );

            case EItemType.select:
              return (
                <Box key={index}>
                  <Typography className={classes.widgetLabel}>
                    {label}
                  </Typography>
                  <TextField
                    id={`side-filter-select-${stateKey}`}
                    select
                    variant="outlined"
                    value={filterValues[stateKey]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.persist();
                      changeFilterValues(stateKey, event?.target?.value);
                    }}
                  >
                    {widgetProps?.options &&
                      widgetProps.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
              );

            case EItemType.check:
              return (
                <Box key={index}>
                  <FormGroup row>
                    <FormControlLabel
                      className={classes.checkItem}
                      control={
                        <Checkbox
                          checked={filterValues[stateKey]}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            changeFilterValues(
                              stateKey,
                              event?.target?.checked,
                            );
                          }}
                          name={stateKey}
                        />
                      }
                      label={
                        <Typography className={classes.checkItemLabel}>
                          {label}
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Box>
              );

            default:
              return null;
          }
        },
      )}
    </Box>
  );

  const Footer = (
    <Box className={classes.footer}>
      <Button
        variant="contained"
        className={classes.submitButton}
        color="primary"
        onClick={handleFilterSubmit}
      >
        APPLY
      </Button>
      <Button
        size="small"
        onClick={handleClickCancel}
        className={classes.cancelButton}
      >
        CANCEL
      </Button>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <SwipeableDrawer
        anchor="right"
        open={visible}
        onClose={closeDrawer}
        onOpen={() => {}}
        disableBackdropClick
      >
        <Box className={classes.drawerContainer}>
          <Box display="flex" flexDirection="column">
            {Header}
            {Body}
          </Box>
          {Footer}
        </Box>
      </SwipeableDrawer>
    </ThemeProvider>
  );
};

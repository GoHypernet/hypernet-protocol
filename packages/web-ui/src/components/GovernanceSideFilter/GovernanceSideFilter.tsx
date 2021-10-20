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
  MenuItem,
  Divider,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

import { useStyles } from "@web-ui/components/GovernanceSideFilter/GovernanceSideFilter.style";

import { SliderRange } from "@web-ui/components";

export const GovernanceSideFilter: React.FC<IGovernanceSideFilterProps> = (
  props: IGovernanceSideFilterProps,
) => {
  const {
    visible,
    onClose,
    itemsCount = -1,
    filterItems,
    onFilterSubmit,
  } = props;
  const classes = useStyles();
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    setDefaultFilterValues();
  }, []);

  const setDefaultFilterValues = () => {
    const defaultFilterValues = filterItems.reduce((acc, item) => {
      if (item.widgetType === ESideFilterItemType.dateTimeDifference) {
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
        <Typography variant="h4" color="textPrimary">
          Filter
        </Typography>
        {itemsCount > -1 && (
          <Typography variant="h6" className={classes.headerInfo}>
            {itemsCount} results
          </Typography>
        )}
      </Box>
      <IconButton aria-label="close" onClick={handleClickCancel}>
        <CloseIcon className={classes.headerIcon} />
      </IconButton>
    </Box>
  );

  const Body = (
    <Box className={classes.body}>
      {filterItems.map(
        ({ widgetType, widgetProps, label, stateKey }, index: number) => {
          switch (widgetType) {
            case ESideFilterItemType.chip:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
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

            case ESideFilterItemType.rangeSlider:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
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

            case ESideFilterItemType.stringInput:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
                    {label}
                  </Typography>
                  <TextField
                    className={classes.textFieldWrapper}
                    placeholder="Filter Data"
                    variant="filled"
                    fullWidth
                    value={filterValues[stateKey]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.persist();
                      changeFilterValues(stateKey, event?.target?.value);
                    }}
                    size="small"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </Box>
              );

            case ESideFilterItemType.dateTime:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
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
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </Box>
              );

            case ESideFilterItemType.dateTimeDifference:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
                    {label}
                  </Typography>
                  <Box className={classes.dateWrapper}>
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      className={classes.dateLabel}
                    >
                      From
                    </Typography>
                    <TextField
                      className={classes.textFieldWrapper}
                      id="datetime-local-from"
                      type="datetime-local"
                      value={filterValues[`${stateKey}From`]}
                      // label="from"
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
                  <Box className={classes.dateWrapper}>
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      className={classes.dateLabel}
                    >
                      To
                    </Typography>
                    <TextField
                      className={classes.textFieldWrapper}
                      id="datetime-local-to"
                      type="datetime-local"
                      value={filterValues[`${stateKey}To`]}
                      // label="to"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        event.persist();
                        changeFilterValues(
                          `${stateKey}To`,
                          event?.target?.value,
                        );
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Box>
              );

            case ESideFilterItemType.select:
              return (
                <Box key={index} className={classes.widgetWrapper}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className={classes.widgetLabel}
                  >
                    {label}
                  </Typography>
                  <TextField
                    className={classes.selectWrapper}
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

            case ESideFilterItemType.check:
              return (
                <Box key={index} className={classes.widgetWrapper}>
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
                        <Typography variant="h6" color="textSecondary">
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
        size="medium"
        onClick={handleClickCancel}
        className={classes.cancelButton}
      >
        CANCEL
      </Button>
      <Button
        size="medium"
        variant="contained"
        className={classes.submitButton}
        color="primary"
        onClick={handleFilterSubmit}
      >
        APPLY
      </Button>
    </Box>
  );

  return (
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
          <Divider />
          {Body}
        </Box>
        {Footer}
      </Box>
    </SwipeableDrawer>
  );
};

export enum ESideFilterItemType {
  chip = "chip",
  rangeSlider = "rangeSlider",
  stringInput = "stringInput",
  check = "check",
  select = "select",
  dateTime = "dateTime",
  dateTimeDifference = "dateTimeDifference",
}
export interface IChipsFilterWidgetItemNew {
  label: string;
  value: string;
}

export interface IChipsFilterWidgetNew {
  chipItems?: IChipsFilterWidgetItemNew[];
  selectedItemValue?: string;
}

export interface IRangeSliderFilterWidgetNew {
  maxValue?: number;
  minValue?: number;
  selectedMaxValue?: number;
  selectedMinValue?: number;
}

export interface ISelectFilterWidgetNew {
  options?: IFilterOptionNew[];
}

export interface IDateTimePickerWidgetNew {
  hideTime?: boolean;
}

export interface IFilterOptionNew {
  label: string;
  value: any;
  subText?: string;
}

export interface IFilterItemNew {
  label: string;
  stateKey: string;
  widgetType: ESideFilterItemType;
  widgetProps?: IFilterWidgetsNew;
  defaultValue?: string | string[] | number | number[];
}

export interface IFilterWidgetsNew
  extends IChipsFilterWidgetNew,
    IRangeSliderFilterWidgetNew,
    ISelectFilterWidgetNew,
    IDateTimePickerWidgetNew {}

export interface IAppliedFilterContainerNew {
  label: string;
  children: React.ReactNode;
}
export interface IGovernanceSideFilterProps {
  visible: boolean;
  itemsCount?: number;
  onClose: () => void;
  filterItems: Array<IFilterItemNew>;
  onFilterSubmit: (values: any) => void;
  onReset?: () => void;
}

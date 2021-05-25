export enum EItemType {
  chip = "chip",
  rangeSlider = "rangeSlider",
  stringInput = "stringInput",
  check = "check",
  select = "select",
  dateTime = "dateTime",
}
export interface IChipsFilterWidgetItem {
  label: string;
  value: string;
}

export interface IChipsFilterWidget {
  chipItems?: IChipsFilterWidgetItem[];
  selectedItemValue?: string;
}

export interface IRangeSliderFilterWidget {
  maxValue?: number;
  minValue?: number;
  selectedMaxValue?: number;
  selectedMinValue?: number;
}

export interface ISelectFilterWidget {
  options?: IFilterOption[];
}

export interface IDateTimePickerWidget {
  hideTime?: boolean;
}

export interface IFilterOption {
  label: string;
  value: any;
  subText?: string;
}

export interface IFilterItem {
  label: string;
  stateKey: string;
  widgetType: EItemType;
  widgetProps?: IFilterWidgets;
  defaultValue?: string | string[] | number | number[];
}

export interface IFilterWidgets
  extends IChipsFilterWidget,
    IRangeSliderFilterWidget,
    ISelectFilterWidget,
    IDateTimePickerWidget {}

export interface IAppliedFilterContainer {
  label: string;
  children: React.ReactNode;
}
export interface ISideFilterProps {
  visible: boolean;
  itemsCount?: number;
  onClose: () => void;
  filterItems: Array<IFilterItem>;
  onFilterSubmit: (values: any) => void;
  onReset?: () => void;
}

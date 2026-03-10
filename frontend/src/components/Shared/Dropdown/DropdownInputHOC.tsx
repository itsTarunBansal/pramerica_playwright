import React, { useState } from 'react';
import { Select, Option, FormControl, FormLabel } from '@mui/joy';


interface DropdownProps {
  label: string;
  options: Array<any>;
  labelKey: string;
  valueKey: string;
  required?: boolean;
  initialValue?: string;
  defaultValue?: any;
  onChange?: any;
  sx?: any
  disabled?: boolean;
  slotProps?: any;
  value?: any;
}

const DropdownHOC: React.FC<DropdownProps> = ({
  label,
  options,
  labelKey,
  valueKey,
  required = false,
  initialValue = '',
  defaultValue: defaultOption,
  onChange,
  sx,
  disabled,
  slotProps,
  value
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);

  const handleChange = (newValue: any) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue); // Optional: Notify parent of value change
    }
  };

  return (
    <FormControl required={required}>
      <FormLabel>{label}</FormLabel>
      <Select
        defaultValue={defaultOption}
        sx={sx}
        value={value}
        onChange={(e: any, newValue: any) => handleChange(newValue)}
        slotProps={slotProps}
        disabled={disabled}
        >
        {options.map((option, index) => (
          <Option key={index} value={option[valueKey]}>
            {option[labelKey]}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownHOC;

//create an AUtocmplete HOC to be used in the dropdown  component
import { Autocomplete } from '@mui/joy';
import React, { useState } from 'react';
import { FormControl, FormLabel } from '@mui/joy';

interface AutocompleteProps {
    label: string;
    options: Array<any>;
    required?: boolean;
    initialValue?: string;
    defaultValue?: any;
    onChange?: any;
    sx?: any;
    key?: any;
    getOptionLabel?: (option: any) => string;
}

const AutocompleteHOC: React.FC<AutocompleteProps> = ({
    label,
    options,
    required = false,
    initialValue = '',
    defaultValue: defaultOption,
    onChange,
    sx,
    key,
    getOptionLabel
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
            <Autocomplete
                key={key}
                options={options}
                onChange={onChange}
                getOptionLabel={getOptionLabel}
            />
        </FormControl>
    );
};

export default AutocompleteHOC;

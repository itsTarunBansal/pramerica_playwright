import React from 'react';
import { FormControl, FormLabel, Input } from '@mui/joy';
import moment from 'moment';
import { Form } from 'react-router-dom';

interface FormInputProps {
    value: string; // The selected date value in 'YYYY-MM-DD' format
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle changes
    placeholder?: string; // Optional placeholder for the input field
    required?: boolean; // Optional flag for the required attribute
    fullWidth?: boolean; // Optional flag for the full width attribute
    sx?: any;
    size?: 'sm' | 'md' | 'lg'; // Optional size of the input field
    label: string;
    slotProps?: any;
    type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    value,
    onChange,
    placeholder = '',
    required = false,
    fullWidth = false,
    sx,
    size,
    label,
    slotProps,
    type
}) => {
    return (
        <FormControl required={required}>
            <FormLabel>{label}</FormLabel>
            <Input
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                placeholder={placeholder}
                required={required}
                size={size}
                sx={sx}
                slotProps={slotProps}
                type={type}
                />
      </FormControl>
    );
};

export default FormInput;

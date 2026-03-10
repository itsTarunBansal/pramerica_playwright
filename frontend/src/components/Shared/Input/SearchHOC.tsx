import React from 'react';
import { Input } from '@mui/joy';
import moment from 'moment';

interface SearchProps {
    value: string; // The selected date value in 'YYYY-MM-DD' format
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle changes
    placeholder?: string; // Optional placeholder for the input field
    required?: boolean; // Optional flag for the required attribute
    fullWidth?: boolean; // Optional flag for the full width attribute
    sx?: any;
    size?: 'sm' | 'md' | 'lg'; // Optional size of the input field
}

const Search: React.FC<SearchProps> = ({
    value,
    onChange,
    placeholder = '',
    required = false,
    fullWidth = false,
    sx,
    size,
}) => { 
    return (
        <>
            {/* <label htmlFor={name}>{label}</label> */}
            <Input
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                placeholder={placeholder}
                required={required} 
                size={size}   
                sx={sx}
            />
        </>
    );
};

export default Search;

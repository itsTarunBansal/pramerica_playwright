import React from 'react';
import { Input } from '@mui/joy';
import moment from 'moment';

interface DateInputProps {
    value: string; // The selected date value in 'YYYY-MM-DD' format
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle changes
    label: string; // The label text for the input
    name: string; // The name attribute for the input field
    placeholder?: string; // Optional placeholder for the input field
    required?: boolean; // Optional flag for the required attribute
    daysBefore?: number; // The number of days before the current date that can be selected
    sx?: any;
}

const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    label,
    name,
    placeholder = '',
    required = false,
    daysBefore = 0, 
    sx,
}) => {
    const currentDate = new Date();
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() - daysBefore); 

    const minDateString : string = moment(minDate).format('YYYY-MM-DD')
    const maxDateString : string= moment(currentDate).format('YYYY-MM-DD') 

    return (
        <div>
            {/* <label htmlFor={name}>{label}</label> */}
            <Input
                name={name}
                value={value}
                onChange={onChange}
                type="date"
                placeholder={placeholder}
                required={required}
                slotProps= {
                    daysBefore ? {
                        input: {
                          min: minDateString,
                          max: maxDateString,
                        },
                      } : {
                        input: {
                          max: maxDateString,
                        },
                      }
                } 
                    
                sx={sx}
            />
        </div>
    );
};

export default DateInput;

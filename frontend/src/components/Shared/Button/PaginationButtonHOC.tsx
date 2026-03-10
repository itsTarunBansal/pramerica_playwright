import React from 'react';
import { Stack } from '@mui/joy';
import ButtonHoc from './ButtonHoc';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface Props extends React.ComponentProps<typeof ButtonHoc> {
    props?: any;
    prevUrl?: any;
    nextUrl?: any; 
    filterAPI?: any;
}

const PaginationHOC: React.FC<Props> = (props) => {
    const { prevUrl, nextUrl, filterAPI } = props;
    const dispatch = useDispatch<AppDispatch>();
    // const dispatch= useDispatch<AppDispatch>()
    // console.log(dispatch(filterAPI()), 'disp----+++')
    const handlePrev = async () => {
        await dispatch(filterAPI(`&${prevUrl}`));
    }
    const handleNext = async () => {
        await dispatch(filterAPI(`&${nextUrl}`));
    }
    return (
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
            <ButtonHoc
                {...props}
                onClick={() => handlePrev()}
                disabled={!prevUrl}
                startDecorator={<KeyboardArrowLeftIcon />}
            >
                Prev
            </ButtonHoc>
            <ButtonHoc
                {...props}
                onClick={() => handleNext()}
                disabled={!nextUrl}
                endDecorator={<KeyboardArrowRightIcon />}
            >
                Next
            </ButtonHoc>
        </Stack>
    );
};

export default PaginationHOC;

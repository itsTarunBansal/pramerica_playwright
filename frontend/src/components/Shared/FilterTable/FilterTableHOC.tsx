import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Grid, Typography, Stack } from '@mui/joy';

const FilterTableHOC = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    // Filtering states
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [textFilter, setTextFilter] = useState<string>('');

    const [filteredData, setFilteredData] = useState<any[]>(props.data || []);

    // Function to handle filtering
    // useEffect(() => {
    //   let filtered = props.data || [];
      
    //   if (startDate) {
    //     filtered = filtered.filter(item =>.date >= startDate);
    //   }

    //   if (endDate) {
    //     filtered = filtered.filter(item => item.date <= endDate);
    //   }

    //   if (textFilter) {
    //     filtered = filtered.filter(item =>
    //       Object.values(item).some(value =>
    //         value.toString().toLowerCase().includes(textFilter.toLowerCase())
    //       )
    //     );
    //   }

    //   setFilteredData(filtered);
    // }, [startDate, endDate, textFilter, props.data]);

    // Handler for search button click
    const handleSearch = () => {
      setFilteredData(filteredData); // This would trigger the filtering inside useEffect
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Typography level="h2" component="h1">
          Data Table with Filters
        </Typography>
        <Stack direction="row" spacing={2}>
          <Grid container spacing={2}>
            <Grid>
              <Input
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
              />
            </Grid>
            <Grid>
              <Input
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
              />
            </Grid>
            <Grid>
              <Input
                name="textFilter"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
                type="text"
                placeholder="Search"
              />
            </Grid>
            <Grid>
              <Button variant="solid" color="primary" onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Stack>
        <WrappedComponent data={filteredData} {...props} />
      </Box>
    );
  };
};

export default FilterTableHOC;

import React from 'react';
import { Button, Grid, Stack } from '@mui/joy';
import * as XLSX from 'xlsx';

interface ExportReportButtonProps {
    data: any[]; 
    headers: string[]; 
    dataMapper: (item: any) => { [key: string]: any };
    fileName?: string; 
    size?: 'sm' | 'md' | 'lg';
}

const ExportReportButton: React.FC<ExportReportButtonProps> = ({ data, headers, dataMapper, fileName, size }) => {

    const downloadReportEXL = () => {
        // Map the data using the provided dataMapper function
        const dataToExport = data?.length > 0 ? data.map(dataMapper) : [];
        // Convert the data and headers to a worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Convert the workbook to a binary Excel file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to a Blob
        const s2ab = (s: string) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++)
                view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Trigger the download
        if ((navigator as any).msSaveBlob) {
            // For IE 10+
            (navigator as any).msSaveBlob(blob, fileName);
        } else {
            // For other browsers
            const link:any = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    };

    return (
        <Stack direction="row" spacing={2} justifyContent="space-between">
            <Grid container direction="row" spacing={2}>
                <Grid>
                    <Button
                        size={size}
                        variant="solid"
                        color="warning"
                        onClick={downloadReportEXL}
                    >
                        Download Report
                    </Button>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default ExportReportButton;

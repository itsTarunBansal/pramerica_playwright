import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { getZipnachApplicationDetails } from '../features/zipnach/zipnachApiActions';
import { postBankAuthentication } from '../features/authentication/authenticationApiActions';
import { AppDispatch } from '../redux/store';

interface ProcessedRow {
  applicationNumber: string;
  accountNumber: string;
  ifsc: string;
  pennyDropStatus: string;
  pennyDropName: string;
  statusCode: string;
  bankAuthResponse: any;
  [key: string]: any;
}

export const useExcelProcessor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processExcelFile = async (file: File): Promise<ProcessedRow[]> => {
    setProcessing(true);
    setProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const results: ProcessedRow[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        setProgress(((i + 1) / jsonData.length) * 100);

        const appNumber = row.applicationNumber || row['Application Number'];
        
        if (!appNumber) {
          results.push({
            ...row,
            applicationNumber: '',
            accountNumber: '',
            ifsc: '',
            pennyDropStatus: 'NO_APP_NUMBER',
            pennyDropName: 'No application number',
            statusCode: '400',
            bankAuthResponse: null,
          });
          continue;
        }

        try {
          // Fetch application details
          const appResponse = await dispatch(getZipnachApplicationDetails(`/?app_number=${appNumber}`));
          
          if (appResponse.payload?.results?.[0]) {
            const appData = appResponse.payload.results[0];
            
            // Bank authentication
            const bankPayload = {
              accountNumber: (row.accountNumber || appData.acc_no)?.toString().trim(),
              ifsc: (row.ifsc || appData.ifsccode)?.toString().trim(),
              preset: "G",
              clientData: {},
              suppressReorderPenalty: false,
              consent: "Y",
              nameMatchType: 0,
              allowPartialMatch: false,
            };

            const bankResponse = await dispatch(postBankAuthentication(bankPayload));
            const bankResult = bankResponse.payload?.result?.data?.source?.[0];

            results.push({
              ...row,
              applicationNumber: appNumber,
              accountNumber: bankPayload.accountNumber,
              ifsc: bankPayload.ifsc,
              pennyDropStatus: bankResult?.statusAsPerSource || 'INVALID',
              pennyDropName: bankResult?.data?.accountName || 'NA',
              statusCode: bankResult?.statusAsPerSource === 'VALID' ? '101' : '102',
              bankAuthResponse: bankResponse.payload,
            });
          } else {
            results.push({
              ...row,
              applicationNumber: appNumber,
              accountNumber: '',
              ifsc: '',
              pennyDropStatus: 'APP_NOT_FOUND',
              pennyDropName: 'Application not found',
              statusCode: '404',
              bankAuthResponse: null,
            });
          }
        } catch (error) {
          results.push({
            ...row,
            applicationNumber: appNumber,
            accountNumber: '',
            ifsc: '',
            pennyDropStatus: 'ERROR',
            pennyDropName: 'Processing error',
            statusCode: '500',
            bankAuthResponse: null,
          });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const downloadExcel = (data: ProcessedRow[], filename: string = 'processed_data.xlsx') => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Processed Data');
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  return {
    processExcelFile,
    downloadExcel,
    processing,
    progress,
  };
};
import * as React from 'react';
import { SxProps, Theme } from '@mui/system';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';

// Type definitions for dynamic table headers and rows
interface TableColumn {
  id?: string;
  label: string;
  numeric?: boolean; // For aligning the column values
}

interface TableRow {
  [key: string]: string | number;
}

interface TableHocProps {
  columns: TableColumn[]; // Array of column headers
  rows: TableRow[]; // Array of row data
  stripe?: 'odd' | 'even'; // Striped rows option
  sx?: any; // Custom styles
}

const TableHoc: React.FC<TableHocProps> = ({
  columns,
  rows,
  stripe = 'odd',
  sx,
}) => {
  const [stripeType, setStripeType] = React.useState<'odd' | 'even'>(stripe);

  const handleStripeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStripeType(event.target.value as 'odd' | 'even');
  };

  // Function to apply stripe styles to rows
  const applyStripeStyle = (index: number) => {
    if (stripeType === 'odd' && index % 2 === 1) {
      return { backgroundColor: 'rgba(0, 0, 0, 0.04)' }; // odd row stripe
    }
    if (stripeType === 'even' && index % 2 === 0) {
      return { backgroundColor: 'rgba(0, 0, 0, 0.04)' }; // even row stripe
    }
    return {}; // no stripe
  };

  return (
    <Sheet sx={{ p: 2, ...sx }}>
      <FormControl orientation="horizontal" sx={{ mb: 2 }}>
        <FormLabel>Stripe:</FormLabel>
        <RadioGroup
          orientation="horizontal"
          value={stripeType}
          onChange={handleStripeChange}
        >
          <Radio label="odd" value="odd" />
          <Radio label="even" value="even" />
        </RadioGroup>
      </FormControl>

      <Table aria-label="dynamic table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ textAlign: column.numeric ? 'right' : 'left' }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              style={applyStripeStyle(index)} // Apply stripe style
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  style={{ textAlign: column.numeric ? 'right' : 'left' }}
                >
                  {/* {row[column.id]} */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default TableHoc;

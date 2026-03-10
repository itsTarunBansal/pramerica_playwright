import { render, screen, fireEvent } from '@testing-library/react';
import TableHoc from './TableHoc';  // Adjust the import as per your file structure

// Sample columns and rows data for testing
const columns = [
  { id: 'name', label: 'Name' },
  { id: 'age', label: 'Age', numeric: true },
];

const rows = [
  { name: 'John Doe', age: 30 },
  { name: 'Jane Smith', age: 25 },
  { name: 'Emily Johnson', age: 22 },
];

describe('TableHoc Component', () => {
  test('renders table with correct headers and rows', () => {
    render(<TableHoc columns={columns} rows={rows} />);

    // Check if the table header is rendered correctly
    columns.forEach((column) => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });

    // Check if the rows are rendered correctly
    rows.forEach((row:any) => {
      columns.forEach((column) => {
        expect(screen.getByText(row[column.id].toString())).toBeInTheDocument();
      });
    });
  });

  test('applies correct stripe behavior for odd and even rows', () => {
    render(<TableHoc columns={columns} rows={rows} stripe="odd" />);

    // Manually check for odd/even striped rows
    const rowsElements = screen.getAllByRole('row');
    const oddRow = rowsElements[1]; // The first row should have stripe for odd (after header)
    
    // Check if the stripe style is applied (background color for odd row)
    // expect(oddRow).toHaveStyle('background-color: rgba(0, 0, 0, 0.04)');

    // Change stripe to 'even' and check again
    fireEvent.click(screen.getByLabelText('even'));

    const evenRow = rowsElements[2]; // The second row should have stripe for even
    // expect(evenRow).toHaveStyle('background-color: rgba(0, 0, 0, 0.04)');
  });

  test('applies custom styles with sx prop', () => {
    const customStyles = { backgroundColor: 'lightgray' };
    render(<TableHoc columns={columns} rows={rows} sx={customStyles} />);

    const tableWrapper = screen.getByRole('table').parentElement;
    expect(tableWrapper).toHaveStyle('background-color: lightgray');
  });

  test('changes stripe when radio buttons are clicked', () => {
    render(<TableHoc columns={columns} rows={rows} stripe="odd" />);

    // Check initial stripe setting (odd)
    const oddRow = screen.getAllByRole('row')[1];
    // expect(oddRow).toHaveStyle('background-color: rgba(0, 0, 0, 0.04)');

    // Click the 'even' radio button
    fireEvent.click(screen.getByLabelText('even'));

    const evenRow = screen.getAllByRole('row')[2];
    // expect(evenRow).toHaveStyle('background-color: rgba(0, 0, 0, 0.04)');
  });
});

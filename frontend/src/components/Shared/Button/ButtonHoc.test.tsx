import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonHoc from './ButtonHoc';

describe('ButtonHoc Component', () => {
  test('renders correctly with default props', () => {
    render(<ButtonHoc>Click Me</ButtonHoc>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('MuiButton-root'); // Verify that it has the base class
    expect(buttonElement).toHaveClass('MuiButton-variantSolid'); // Check the default variant class
    expect(buttonElement).toHaveClass('MuiButton-colorPrimary'); // Check the default color class
  });

  test('applies provided props', () => {
    render(
      <ButtonHoc
        className="custom-class"
        size="lg"
        variantType="outlined"
        buttonType="submit"
        color="danger"
        disabled
      >
        Submit
      </ButtonHoc>
    );
    const buttonElement = screen.getByRole('button', { name: /submit/i });

    expect(buttonElement).toHaveClass('custom-class'); // Verify custom class is applied
    expect(buttonElement).toHaveClass('MuiButton-variantOutlined'); // Verify outlined variant is applied
    expect(buttonElement).toHaveClass('MuiButton-colorDanger'); // Verify danger color is applied
    expect(buttonElement).toHaveAttribute('type', 'submit'); // Verify button type
    expect(buttonElement).toBeDisabled(); // Verify disabled prop
  });
  test('triggers onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonHoc onClick={handleClick}>Click Me</ButtonHoc>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders children correctly', () => {
    render(<ButtonHoc>Click Me</ButtonHoc>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    expect(buttonElement).toHaveTextContent('Click Me');
  });

  test('applies custom styles with sx prop', () => {
    const customStyles = { backgroundColor: 'red', color: 'white' };
    render(<ButtonHoc sx={customStyles}>Styled Button</ButtonHoc>);
    const buttonElement = screen.getByRole('button', { name: /styled button/i });

    expect(buttonElement).toHaveStyle('background-color: red');
    expect(buttonElement).toHaveStyle('color: white');
  });
});

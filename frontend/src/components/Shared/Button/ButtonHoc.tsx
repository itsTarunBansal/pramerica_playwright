import React from 'react';
import Button from '@mui/joy/Button';
import { SxProps, Theme } from '@mui/system';
import { start } from 'repl';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'solid' | 'soft' | 'outlined' | 'plain';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonColor = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

interface ButtonHocProps  extends React.ComponentProps<typeof Button> {
  className?: any;
  size?: ButtonSize;
  variantType?: ButtonVariant;
  buttonType?: ButtonType; // Renamed to `buttonType` for consistency
  color?: ButtonColor;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  sx?: any; // Correct type for sx prop
  children: React.ReactNode;
  startDecorator?: React.ReactNode;
  props?: any;
}

const ButtonHoc: React.FC<ButtonHocProps> = ({
  props,
  children,
  startDecorator,
  endDecorator,
  className,
  size,
  variantType,
  buttonType,
  color,
  onClick,
  disabled,
  sx,
}) => {
  const getButtonVariant = (type?: ButtonVariant) => {
    switch (type) {
      case 'soft':
        return 'soft';
      case 'outlined':
        return 'outlined';
      case 'plain':
        return 'plain';
      default:
        return 'solid';
    }
  };

  const getButtonType = (type?: ButtonType) => {
    switch (type) {
      case 'button':
        return 'button';
      case 'submit':
        return 'submit';
      case 'reset':
        return 'reset';
      default:
        return 'button';
    }
  };

  const getButtonColor = (color?: ButtonColor) => {
    switch (color) {
      case 'neutral':
        return 'neutral';
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'primary':
      default:
        return 'primary';
    }
  };

  return (
    <Button
      className={className}
      size={size}
      variant={getButtonVariant(variantType)}
      type={getButtonType(buttonType)} // Use `buttonType` here
      color={getButtonColor(color)}
      onClick={onClick}
      disabled={disabled}
      startDecorator={startDecorator}
      endDecorator={endDecorator}
      sx={sx} // Pass sx directly here
    >
      {children}
    </Button>
  );
};

export default ButtonHoc;

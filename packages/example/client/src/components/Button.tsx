import { Button, CircularProgress } from '@mui/material';
import { AppButtonProps } from '../types/types';

const AppButton: React.FC<AppButtonProps> = ({
  id,
  label,
  onClick,
  textColor,
  sx,
  variant = 'primary',
  disabled,
  backgroundColor,
  hoverBackgroundColor,
  tabIndex,
  loading = false,
  type = 'submit',
  ...props
}) => {
  const buttonStyles = {
    color: textColor || (variant === 'text' ? 'inherit' : undefined),
    backgroundColor: backgroundColor,
    '&:hover': {
      backgroundColor: hoverBackgroundColor || backgroundColor, // Use hover color or fallback to normal backgroundColor
    },
    ...(variant === 'text' && {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    }),
    ...sx,
  };
  return (
    <Button
      id={id}
      fullWidth
      variant={variant === 'primary' ? 'contained' : 'text'}
      color={variant === 'text' ? 'inherit' : 'primary'}
      disabled={disabled || loading}
      onClick={e => onClick(e)}
      sx={buttonStyles}
      tabIndex={tabIndex}
      type={type}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: 'absolute',
            zIndex: 1,
          }}
        />
      )}
      <span
        style={{
          visibility: loading ? 'hidden' : 'visible',
        }}
      >
        {label}
      </span>
    </Button>
  );
};

export default AppButton;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    danger: 'btn btn-danger',
    warning: 'btn btn-warning',
    info: 'btn btn-info',
    light: 'btn btn-light',
    dark: 'btn btn-dark',
    outlinePrimary: 'btn btn-outline-primary',
    outlineSecondary: 'btn btn-outline-secondary',
    outlineSuccess: 'btn btn-outline-success',
    outlineDanger: 'btn btn-outline-danger',
    outlineWarning: 'btn btn-outline-warning',
    outlineInfo: 'btn btn-outline-info',
    outlineLight: 'btn btn-outline-light',
    outlineDark: 'btn btn-outline-dark'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      type={type}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
      )}
      {children}
    </button>
  );
};

export default Button;

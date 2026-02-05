const Card = ({ 
  children, 
  className = '', 
  title, 
  footer,
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'card-custom',
    primary: 'card-custom card-primary',
    secondary: 'card-custom card-secondary',
    success: 'card-custom card-success',
    danger: 'card-custom card-danger',
    warning: 'card-custom card-warning',
    info: 'card-custom card-info',
    light: 'card-custom card-light',
    dark: 'card-custom card-dark'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`} {...props}>
      {title && (
        <div className="card-header-custom">
          <h5 className="card-title-custom mb-0">{title}</h5>
        </div>
      )}
      <div className="card-body-custom">
        {children}
      </div>
      {footer && (
        <div className="card-footer-custom">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

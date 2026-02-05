import { useEffect } from 'react';

const Modal = ({ 
  show, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  centered = true,
  backdrop = true,
  keyboard = true
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleBackdropClick = (e) => {
    if (backdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (keyboard && e.key === 'Escape') {
      onClose();
    }
  };

  if (!show) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div 
      className={`modal fade show ${centered ? 'modal-dialog-centered' : ''}`}
      style={{ display: 'block', backgroundColor: backdrop ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`modal-dialog ${sizeClasses[size]}`}>
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

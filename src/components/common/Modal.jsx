import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children, size = 'md', ...props }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'w-96',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${sizes[size]} bg-white rounded-lg shadow-lg p-6`} {...props}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Modal;

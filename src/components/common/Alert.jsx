import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${styles[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="text-lg font-bold">
          ✕
        </button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  autoClose: PropTypes.number,
};

export default Alert;

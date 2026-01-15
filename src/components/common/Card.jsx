import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const styles = `bg-white rounded-lg shadow ${hover ? 'hover:shadow-lg' : ''} ${className}`;
  return (
    <div className={styles} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;

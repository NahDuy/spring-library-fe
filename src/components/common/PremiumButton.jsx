import React from 'react';

const PremiumButton = ({
    children,
    onClick,
    type = "button",
    variant = "contained", // contained, outlined, text
    fullWidth = false,
    className = "",
    style = {},
    ...props
}) => {

    const baseStyle = {
        padding: '10px 24px',
        borderRadius: '30px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        border: 'none',
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        width: fullWidth ? '100%' : 'auto',
        ...style
    };

    const variants = {
        contained: {
            background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: 'none',
        },
        outlined: {
            background: 'transparent',
            color: '#1a237e',
            border: '2px solid #1a237e',
            boxShadow: 'none',
        },
        text: {
            background: 'transparent',
            color: '#1a237e',
            border: 'none',
            boxShadow: 'none',
            padding: '8px 16px',
        }
    };

    // Merge styles
    const computedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...style
    };

    const handleMouseEnter = (e) => {
        if (variant === 'contained') {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)';
        } else if (variant === 'outlined') {
            e.currentTarget.style.background = 'rgba(26, 35, 126, 0.04)';
        }
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'none';
        if (variant === 'contained') {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
        } else if (variant === 'outlined') {
            e.currentTarget.style.background = 'transparent';
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            style={computedStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </button>
    );
};

export default PremiumButton;

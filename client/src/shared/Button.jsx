import React from 'react'

const Button = ({ children, type, color, className, size = 'btn-md', ...rest }) => {
  return (
    <button
      className={`btn ${size} w-fit text-slate-100 bg-${color}-500 hover:bg-${color}-400 active:bg-${color}-500 ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
};

export default Button;
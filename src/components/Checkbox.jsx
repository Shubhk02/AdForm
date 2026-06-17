import React from 'react';

const Checkbox = ({ checked, onChange, id, className = '' }) => {
  return (
    <label htmlFor={id} className={`flip-cbx ${className}`}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <div className="checkmark">
        <div className="flip">
          <div className="front" />
          <div className="back">
            <svg viewBox="0 0 16 14" height={14} width={16}>
              <path d="M2 8.5L6 12.5L14 1.5" />
            </svg>
          </div>
        </div>
      </div>
    </label>
  );
};

export default Checkbox;

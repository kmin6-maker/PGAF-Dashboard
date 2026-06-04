import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const MultiSelect = ({ options, selectedValues, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(val => val !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      <div 
        className={`multi-select-header ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="multi-select-placeholder">
          {selectedValues.length === 0 
            ? placeholder 
            : selectedValues.length === 1 
              ? selectedValues[0] 
              : `${selectedValues.length} selected`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedValues.length > 0 && (
            <span 
              className="multi-select-clear" 
              onClick={clearSelection}
              title="Clear selection"
            >
              &times;
            </span>
          )}
          <ChevronDown size={16} className="multi-select-arrow" />
        </div>
      </div>

      {isOpen && (
        <div className="multi-select-dropdown animate-fade-in">
          {options.length === 0 ? (
            <div className="multi-select-empty">No options</div>
          ) : (
            options.map(option => {
              if (!option) return null;
              const isSelected = selectedValues.includes(option);
              return (
                <div 
                  key={option} 
                  className={`multi-select-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  <div className="checkbox">
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>{option}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

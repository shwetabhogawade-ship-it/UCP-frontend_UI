import React, { useState, useEffect, useRef } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  isSpecial?: boolean; // e.g. for Consolidated Performance ALL IN ONE
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
  perfSpecialLogic?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  perfSpecialLogic = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();

    let newSelection = [...selectedValues];

    if (perfSpecialLogic) {
      if (value === 'consolidated') {
        newSelection = ['consolidated'];
      } else {
        newSelection = newSelection.filter((v) => v !== 'consolidated');
        if (newSelection.includes(value)) {
          newSelection = newSelection.filter((v) => v !== value);
        } else {
          newSelection.push(value);
        }
      }
    } else {
      if (newSelection.includes(value)) {
        newSelection = newSelection.filter((v) => v !== value);
      } else {
        newSelection.push(value);
      }
    }

    onChange(newSelection);
  };

  const handleRemoveValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className="msd" ref={containerRef}>
      <div
        className={`msd-box ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
      >
        {selectedValues.length === 0 ? (
          <span className="msd-ph">{placeholder}</span>
        ) : (
          options
            .filter((opt) => selectedValues.includes(opt.value))
            .map((opt) => {
              const displayLabel = opt.label.replace('ALL IN ONE', '').trim();
              const shortenedLabel = displayLabel.length > 28 ? `${displayLabel.substring(0, 26)}…` : displayLabel;
              return (
                <span className="tag" key={opt.value}>
                  {shortenedLabel}
                  <span
                    className="tag-x"
                    onClick={(e) => handleRemoveValue(opt.value, e)}
                  >
                    ✕
                  </span>
                </span>
              );
            })
        )}
        <svg className="msd-arrow" viewBox="0 0 10 6" width="10" height="6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className={`msd-dd ${isOpen ? 'open' : ''}`}>
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          const isConsolidated = opt.value === 'consolidated';
          return (
            <div
              key={opt.value}
              className={`msd-opt ${isSelected ? 'sel' : ''}`}
              onClick={(e) => handleSelectOption(opt.value, e)}
              style={isConsolidated ? { borderTop: '2px solid var(--border)', marginTop: '2px' } : undefined}
            >
              <div className="msd-cb"></div>
              {opt.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;

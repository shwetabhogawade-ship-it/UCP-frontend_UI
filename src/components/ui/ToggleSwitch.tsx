import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="tog">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="tog-t"></span>
    </label>
  );
};
export default ToggleSwitch;

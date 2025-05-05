import React from 'react';

interface Props {
  name: string;
  optedIn: boolean;
  onChange: (newValue: boolean) => void;
}

const PreferenceItem: React.FC<Props> = ({ name, optedIn, onChange }) => {
  return (
    <div className="preference-item">
      <span>{name}</span>
      <input
        type="checkbox"
        checked={optedIn}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
};

export default PreferenceItem;

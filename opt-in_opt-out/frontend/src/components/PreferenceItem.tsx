import React from 'react';

interface Props {
  name: string;
  optedIn: boolean;
  onChange: (newValue: boolean) => void;
}

const PreferenceItem: React.FC<Props> = ({ name, optedIn, onChange }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <span className="text-gray-800 font-medium">{name}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={optedIn}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
        <div className="absolute w-4 h-4 bg-white rounded-full transform peer-checked:translate-x-5 transition-all"></div>
      </label>
    </div>
  );
};

export default PreferenceItem;

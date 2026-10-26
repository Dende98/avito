import { useMemo, useState } from 'react';
import { russianCities } from '../lib/russianCities';

type CityInputProps = {
  className?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export function CityInput({ className, placeholder = 'Город', required = false, value, onChange }: CityInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    return russianCities
      .filter((city) => !query || city.toLowerCase().includes(query))
      .slice(0, 7);
  }, [value]);

  return (
    <div className={className ? `city-input ${className}` : 'city-input'}>
      <input
        autoComplete="off"
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
      {isOpen && suggestions.length > 0 && (
        <div className="city-suggestions">
          {suggestions.map((city) => (
            <button
              key={city}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(city);
                setIsOpen(false);
              }}
              type="button"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";

export default function RadioSetting({
  title,
  name,
  options,
  selectedValue,
  onChange,
}) {
  return (
    <div className="radio-setting max-h-screen flex gap-70">
      <h3 className="radio-setting__title">{title}</h3>
      <form className="radio-setting__group flex flex-col gap-15">
        {options.map((option) => (
          <div key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="radio-setting__group__input"
              id={option.value}
            />
            <label
              htmlFor={option.value}
              className="radio-setting__group__label"
            >
              {option.label}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}

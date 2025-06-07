import React from "react";

export default function CheckboxSettings({
  title,
  name,
  option,
  isChecked,
  setIsChecked,
}) {
  return (
    <div className="check-setting max-h-screen">
      <label
        htmlFor={option.value}
        className="check-setting__label flex gap-80"
      >
        <span className="check-setting__label__title">{title}</span>
        <input
          type="checkbox"
          name={name}
          value={option.value}
          checked={isChecked}
          onChange={() => () => setIsChecked(!isChecked)}
          className="check-setting__label__input"
          id={option.value}
        />
        <span className="check-setting__label__toggle">
          <div className="check-setting__label__toggle__circle"></div>
        </span>
      </label>
    </div>
  );
}

import React from "react";

export default function HelpRow({ title, content }) {
  return (
    <div className="help-row">
      <h2 className="help-row__title">{title}</h2>
      <p className="help-row__content">{content}</p>
    </div>
  );
}

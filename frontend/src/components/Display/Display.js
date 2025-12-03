import React from "react";
import './Display.css'

export default function Display({ Icon, Title, Measure, className, style }) {
  return (
    <div className="cards">
      <button className={`balance ${className || ''}`} style={style}>
        <span className="ethsymbl">
          {Icon}
        </span>
        {Title} <br />
        <span>{Measure}</span>
      </button>
    </div>
  );
}

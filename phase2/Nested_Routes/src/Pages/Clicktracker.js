import { setYear } from "date-fns";
import React from "react";
import { useState } from "react";

function Clicktracker() {
  const [model, setModel] = useState('Toyota');
  const [year, setMYear] = useState(2007);

  function handleClick() {
    setModel('Audi');
    setYear(2013);
  }

  return (
    <div>
      <h1>Click Tracker</h1>
      <h3>
        This Car is of model {model} and was made in the year {year}
      </h3>
      <button onClick={handleClick}>Click Here</button>
    </div>
  );
}

export default Clicktracker;

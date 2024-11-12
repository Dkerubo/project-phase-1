import React from "react";
import { useState } from "react";

function Counttracker() {
  const [count, setCount] = useState(20);

  function handleIncreament() {
    setCount(count + 1);
  }
  function handleDecreament() {
    setCount(count - 1);
  }
  return (
    <div>
      <h1>Count Tracker</h1>
      <h2>{count}</h2>

      <button onClick={handleIncreament}>Increament</button>
      <button onClick={handleDecreament}>Decreament</button>
    </div>
  );
}

export default Counttracker;

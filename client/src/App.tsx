import React from 'react';
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    alert('Wahooo!');
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {String(count)}
    </button>
  );
}

function App() {
  return (
    <div>
      <h1>Hello from react!!</h1>
      <MyButton />
      <MyButton />
      <MyButton />
      <MyButton />
    </div>
  );
}


export default App;

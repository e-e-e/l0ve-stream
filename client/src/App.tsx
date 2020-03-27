import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import img1 from './1.jpeg';
import img2 from './2.jpeg';


function App() {
  const [flip, setFlip ] = useState(true);
  useEffect(() => {
    let timer = requestAnimationFrame(loop);
    let previousTime: number;
    function loop(t: number) {
      if (!previousTime) previousTime = t;
      const diff = t - previousTime
      if (diff > 200 ) {
        setFlip(f => !f);
        previousTime = t;
      }
      timer = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(timer);
    }
  })
  return (
    <div className="App">
      <header><h1>❤ l0ve.stream ❤</h1></header>
      <main>
        <p>hello my love, this is a place holder</p>
        <div>
          <img src={flip ? img1 : img2 }/>
        </div>
        <p>it's working though</p>
        <p>we now have a website</p>
        <p>which is deployed automatically</p>
        <p>( ( ( ❤ ) ) )️</p>
      </main>
    </div>
  );
}

export default App;

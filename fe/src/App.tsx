import * as React from 'react';
import './App.css';

import { Connected } from './Connected';
import { EyeColors } from './EyeColors';
import { Log } from './Log';
import { Speak } from './Speak';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BrettBot Control Panel</h1>
          <Connected />
        </header>
        <section className="controls">
          <div className="controls__section">
            <Speak />
          </div>
          <div className="controls__section">
            <EyeColors />
          </div>
          <div className="controls__section">
            <Log />
          </div>
        </section>
      </div>
    );
  }
}

export default App;

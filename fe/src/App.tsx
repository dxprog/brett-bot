import * as React from 'react';
import './App.css';

import { Connected } from './Connected';
import { EyeColors } from './EyeColors';
import { Speak } from './Speak';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BrettBot Control Panel</h1>
          <Connected />
        </header>
        <section class="controls">
          <div class="controls__section">
            <Speak />
          </div>
          <div class="controls__section">
            <EyeColors />
          </div>
        </section>
      </div>
    );
  }
}

export default App;

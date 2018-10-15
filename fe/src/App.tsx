import * as React from 'react';
import './App.css';

import { EyeColors } from './EyeColors';
import { Speak } from './Speak';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BrettBot Control Panel</h1>
        </header>
        <section>
          <Speak />
          <EyeColors />
        </section>
      </div>
    );
  }
}

export default App;

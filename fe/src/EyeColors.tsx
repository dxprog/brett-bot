import * as React from 'react';

import './EyeColors.css';
import { EyeColor } from './EyeColor';
import { post } from './api';

const colors = {
  off: [ false, false, false ],
  red: [ true, false, false ],
  yellow: [ true, true, false ],
  magenta: [ true, false, true ],
  green: [ false, true, false ],
  cyan: [ false, true, true ],
  blue: [ false, false, true ],
  white: [ true, true, true ]
}

export class EyeColors extends React.Component {
  handleColorClick(color: string) {
    const [ red, green, blue ] = colors[color];
    post('eyes', { red, green, blue });
  }

  render() {
    return (
      <div className="eyes">
        <h2>Eye Color</h2>
        {
          Object.keys(colors).map(color => {
            return <EyeColor key={`color-${color}`} color={color} onClick={this.handleColorClick} />;
          })
        }
      </div>
    );
  }
}
import * as React from 'react';

import './EyeColors.css';
import { EyeColor } from './EyeColor';
import { post } from './api';

const colors = {
  off: [ 0, 0, 0 ],
  red: [ 1, 0, 0 ],
  yellow: [ 1, 1, 0 ],
  magenta: [ 1, 0, 1 ],
  green: [ 0, 1, 0 ],
  cyan: [ 0, 1, 1 ],
  blue: [ 0, 0, 1 ],
  white: [ 1, 1, 1 ]
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
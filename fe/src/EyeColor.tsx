import * as React from 'react';

export interface IEyeColor {
  onClick: Function;
  color: string;
  selected?: boolean;
}

export class EyeColor extends React.Component<IEyeColor> {
  render() {
    return (
      <button
        className={`eye-color ${this.props.selected ? 'eye-color--selected' : ''}`}
        onClick={() => this.props.onClick(this.props.color)}
      >
        <span className={`eye-color__swatch eye-color__swatch--${this.props.color}`}>{this.props.color}</span>
      </button>
    );
  }
}
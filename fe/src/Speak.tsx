import * as React from 'react';

import './Speak.css';
import { post } from './api';

export interface ISpeakState {
  text: string;
}

export class Speak extends React.Component<undefined, ISpeakState> {
  constructor() {
    super();
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    post('speak', { text: this.state.text });
    this.setState({ text: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Speak</h2>
        <input className="speak-input" type="text" value={this.state.text} onChange={evt => this.setState({ text: evt.target.value })} />
      </form>
    );
  }
}
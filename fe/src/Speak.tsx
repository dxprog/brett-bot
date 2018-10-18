import * as React from 'react';

import './Speak.css';
import { post } from './api';

export interface ISpeakState {
  text?: string;
}

export class Speak extends React.Component<undefined, ISpeakState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    post('speak', { phrase: this.state.text });
    this.setState({ text: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Speak</h2>
        <input className="speak__input" type="text" value={this.state.text} onChange={evt => this.setState({ text: evt.target.value })} />
        <button type="submit" className="speak__button">Speak</button>
      </form>
    );
  }
}

import * as React from 'react';
import { IEspeakOptions, ESPEAK_DEFAULT_OPTIONS } from './common/espeak';

import './Speak.css';
import { post } from './api';
import { SpeechOptions } from './SpeechOptions';

export interface ISpeakState {
  text?: string;
  options?: IEspeakOptions
}

export class Speak extends React.Component<undefined, ISpeakState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = {
      text: '',
      options: { ...ESPEAK_DEFAULT_OPTIONS }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    post('speak', { ...this.state.options, phrase: this.state.text });
    this.setState({ text: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Speak</h2>
        <input className="speak__input" type="text" value={this.state.text} onChange={evt => this.setState({ text: evt.target.value })} />
        <button type="submit" className="speak__button">Speak</button>
        <SpeechOptions options={this.state.options} />
      </form>
    );
  }
}

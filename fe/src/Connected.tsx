import * as React from 'react';

import { get } from './api';

interface IConnectedState {
  connected: boolean;
}

import './Connected.css';

export class Connected extends React.Component<undefined, IConnectedState> {
  constructor(props: any) {
    super(props);
    this.state = {
      connected: false
    };
    this.updateConnected();
  }

  private async updateConnected() {
    const response: string = await get('status');
    let data = { connected: false };
    try {
      data = JSON.parse(response);
    } catch(err) {
      console.error('There was an error parsing the response');
    }
    this.setState({
      connected: data.connected
    });
  }

  render() {
    return (
      <span className={`connected-icon connected-icon--${this.state.connected ? 'connected' : 'disconnected'}`} />
    );
  }
}
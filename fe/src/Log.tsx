import * as React from 'react';

import { get } from './api';
import './Log.css';
import { LogItem } from './LogItem';
import { LogDateSeparator } from './LogDateSeparator';
import { ILogCommand } from './common/logger';

const { Fragment } = React;
const POLL_DELAY = 10000;

function makeDateString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export interface ILogState {
  logs: Array<ILogCommand>;
}

export class Log extends React.Component<undefined, ILogState> {
  constructor(props: any) {
    super(props);

    this.state = { logs: [] };
    this.getLogs();
  }

  async getLogs() {
    const { logs } = this.state;
    const since = logs.length ? logs[logs.length - 1].date : null;
    const response = await get(`log${since ? '?since=' + since : ''}`);
    let newLogs: Array<ILogCommand> = [];
    try {
      newLogs = JSON.parse(response);
    } catch (err) {
      console.error(err);
    }
    this.setState({ logs: [ ...this.state.logs, ...newLogs ] });
    setTimeout(() => this.getLogs(), POLL_DELAY);
  }

  render() {
    let previousDate = '';
    return (
      <Fragment>
        <h2>Log</h2>
        <ul className="logs">
          {
            this.state.logs.map((log: ILogCommand) => {
              if (log.command === 'speak') {
                const date = new Date(log.date);
                const dateStr = makeDateString(date);
                const logItem = <LogItem command={log} />

                if (dateStr !== previousDate) {
                  previousDate = dateStr;
                  return (
                    <Fragment>
                      <LogDateSeparator date={date} />
                      {logItem}
                    </Fragment>
                  );
                }
                previousDate = dateStr;
                return logItem;
              }
              return null;
            })
          }
        </ul>
      </Fragment>
    );
  }
}
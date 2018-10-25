import * as React from 'react';

import './LogItem.css';
import { ILogCommand } from './common/logger';

export interface ILogItemProps {
  command: ILogCommand;
}

function formatTime(date: Date) {
  let hours = date.getHours();
  const meridian = hours > 12 ? 'pm' : 'am';
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${date.getMinutes()}${meridian}`;
}

export class LogItem extends React.Component<ILogItemProps> {
  render() {
    const date = new Date(this.props.command.date);
    return (
      <li className="log__item">
        <img src="/images/brettbot-avatar.jpg" alt="brettbot" className="log__item-avatar" />
        <div className="log__item-content">
          <p className="log__item-timestamp">{formatTime(date)}</p>
          <p className="log__item-body">{this.props.command.data.phrase}</p>
        </div>
      </li>
    );
  }
}